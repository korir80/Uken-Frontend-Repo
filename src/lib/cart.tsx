import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

// ────────────────────────────────────────────────────────────────────────────
// SPRING BOOT INTEGRATION POINTS:
//   - POST /api/cart/sync  → call on every cart change (future)
//   - GET  /api/cart       → hydrate on login (future)
//   - POST /api/orders     → call on checkout/payment submit (future)
// Until these are wired, cart lives in memory only (with a localStorage
// mirror so a refresh does not drop the bag — the mirror will be removed
// once /api/cart/sync exists).
// ────────────────────────────────────────────────────────────────────────────

/**
 * Cart state — kept lean and serializable so the Spring Boot
 * integration can lift it onto a real /api/cart endpoint with no schema
 * gymnastics. Each line carries enough creator metadata to render the
 * "made by [name]" attribution everywhere without re-fetching.
 */
export interface CartItemCreator {
  id: string;
  fullName: string;
  region: string;
}

export interface CartItem {
  productId: string;
  name: string;
  /** Price in pennies (GBP). Display layer formats to £. */
  pricePence: number;
  image: string;
  creator: CartItemCreator;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  /** Order details captured during checkout. UI-only for now. */
  delivery: DeliveryDetails | null;
  /** Selected delivery zone — drives shipping cost in the summary. */
  selectedZone: SelectedZone | null;
  /** Last placed order, kept until the buyer leaves the confirmation. */
  lastOrder: PlacedOrder | null;
}

export interface SelectedZone {
  id: string;
  name: string;
  country: string;
  shippingPence: number;
}

export interface DeliveryDetails {
  fullName: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface PlacedOrder {
  id: string;
  placedAt: string;
  items: CartItem[];
  delivery: DeliveryDetails;
  subtotalPence: number;
  shippingPence: number;
  totalPence: number;
}

type CartAction =
  | { type: "add"; item: Omit<CartItem, "quantity"> }
  | { type: "remove"; productId: string }
  | { type: "setQty"; productId: string; quantity: number }
  | { type: "clear" }
  | { type: "setDelivery"; delivery: DeliveryDetails }
  | { type: "setZone"; zone: SelectedZone | null }
  | { type: "placeOrder"; order: PlacedOrder }
  | { type: "hydrate"; state: CartState };

const STORAGE_KEY = "ukena.cart.v2";

const initialState: CartState = {
  items: [],
  delivery: null,
  selectedZone: null,
  lastOrder: null,
};

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const existing = state.items.find(
        (i) => i.productId === action.item.productId,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.item.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, quantity: 1 }],
      };
    }
    case "remove":
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.productId),
      };
    case "setQty": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.productId !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: action.quantity }
            : i,
        ),
      };
    }
    case "clear":
      return { ...state, items: [] };
    case "setDelivery":
      return { ...state, delivery: action.delivery };
    case "setZone":
      return { ...state, selectedZone: action.zone };
    case "placeOrder":
      return {
        ...state,
        items: [],
        delivery: null,
        selectedZone: null,
        lastOrder: action.order,
      };
    default:
      return state;
  }
}

/**
 * Aggregated, derived view of the cart. Components must use this rather
 * than recomputing totals locally — that keeps the Spring Boot swap
 * (server-authoritative totals) a single-file change.
 */
export interface CartSummary {
  itemCount: number;
  subtotalPence: number;
  shippingPence: number;
  totalPence: number;
  uniqueCreators: CartItemCreator[];
  uniqueCreatorIds: string[];
  uniqueCreatorNames: string[];
}

interface CartContextValue extends CartState {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  /** Empty the bag without affecting delivery details or last order. */
  clearCart: () => void;
  /** @deprecated use clearCart() — kept for back-compat with older call sites. */
  clearBag: () => void;
  setDelivery: (delivery: DeliveryDetails) => void;
  setZone: (zone: SelectedZone | null) => void;
  placeOrder: (override?: { id?: string }) => PlacedOrder | null;
  /** Aggregated read-only view. Prefer this over per-component calculations. */
  cartSummary: CartSummary;
  // Convenience pass-throughs (also live on cartSummary)
  itemCount: number;
  subtotalPence: number;
  shippingPence: number;
  totalPence: number;
  uniqueCreators: CartItemCreator[];
}

const CartContext = createContext<CartContextValue | null>(null);


const SHIPPING_FREE_THRESHOLD_PENCE = 15000; // Free over £150
const SHIPPING_FLAT_PENCE = 895; // £8.95

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage once on mount (client-only).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CartState>;
        dispatch({
          type: "hydrate",
          state: { ...initialState, ...parsed },
        });
      }
    } catch {
      // Corrupted cart — start fresh, never block the UI.
    }
  }, []);

  // Persist on change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage quota / privacy mode — silently ignore.
    }
  }, [state]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">) => dispatch({ type: "add", item }),
    [],
  );
  const removeItem = useCallback(
    (productId: string) => dispatch({ type: "remove", productId }),
    [],
  );
  const setQuantity = useCallback(
    (productId: string, quantity: number) =>
      dispatch({ type: "setQty", productId, quantity }),
    [],
  );
  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);
  const clearBag = clearCart;
  const setDelivery = useCallback(
    (delivery: DeliveryDetails) => dispatch({ type: "setDelivery", delivery }),
    [],
  );
  const setZone = useCallback(
    (zone: SelectedZone | null) => dispatch({ type: "setZone", zone }),
    [],
  );

  const subtotalPence = useMemo(
    () => state.items.reduce((sum, i) => sum + i.pricePence * i.quantity, 0),
    [state.items],
  );

  // Shipping is server-priced via the selected delivery zone. Until the
  // buyer picks one, shipping reads as zero in the summary and the UI
  // surfaces a "Select delivery zone at checkout" hint instead of a £.
  const shippingPence = state.selectedZone?.shippingPence ?? 0;

  const totalPence = subtotalPence + shippingPence;

  const itemCount = useMemo(
    () => state.items.reduce((n, i) => n + i.quantity, 0),
    [state.items],
  );

  const uniqueCreators = useMemo(() => {
    const seen = new Map<string, CartItemCreator>();
    for (const i of state.items) {
      if (!seen.has(i.creator.id)) seen.set(i.creator.id, i.creator);
    }
    return [...seen.values()];
  }, [state.items]);

  const placeOrder = useCallback(
    (override?: { id?: string }): PlacedOrder | null => {
      if (state.items.length === 0 || !state.delivery) return null;
      const order: PlacedOrder = {
        // Prefer the server's id when available so the confirmation page
        // can deep-link to /account/orders/:id.
        id:
          override?.id ?? `UK-${Date.now().toString(36).toUpperCase()}`,
        placedAt: new Date().toISOString(),
        items: state.items,
        delivery: state.delivery,
        subtotalPence,
        shippingPence,
        totalPence,
      };
      dispatch({ type: "placeOrder", order });
      return order;
    },
    [state.items, state.delivery, subtotalPence, shippingPence, totalPence],
  );

  const cartSummary: CartSummary = useMemo(
    () => ({
      itemCount,
      subtotalPence,
      shippingPence,
      totalPence,
      uniqueCreators,
      uniqueCreatorIds: uniqueCreators.map((c) => c.id),
      uniqueCreatorNames: uniqueCreators.map((c) => c.fullName),
    }),
    [itemCount, subtotalPence, shippingPence, totalPence, uniqueCreators],
  );

  const value: CartContextValue = {
    ...state,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    clearBag,
    setDelivery,
    setZone,
    placeOrder,
    cartSummary,
    itemCount,
    subtotalPence,
    shippingPence,
    totalPence,
    uniqueCreators,
  };


  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
}

/** Format a pence integer as a £ string. */
export function formatGBP(pence: number): string {
  const pounds = pence / 100;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: pence % 100 === 0 ? 0 : 2,
  }).format(pounds);
}
