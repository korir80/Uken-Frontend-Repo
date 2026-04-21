import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

/**
 * Cart state — kept lean and serializable so the Phase 6 Spring Boot
 * integration can lift it onto a real /api/bag endpoint with no schema
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
  /** Last placed order, kept until the buyer leaves the confirmation. */
  lastOrder: PlacedOrder | null;
}

export interface DeliveryDetails {
  fullName: string;
  email: string;
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
  | { type: "placeOrder"; order: PlacedOrder }
  | { type: "hydrate"; state: CartState };

const STORAGE_KEY = "ukena.cart.v1";

const initialState: CartState = {
  items: [],
  delivery: null,
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
    case "placeOrder":
      return {
        ...state,
        items: [],
        delivery: null,
        lastOrder: action.order,
      };
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearBag: () => void;
  setDelivery: (delivery: DeliveryDetails) => void;
  placeOrder: () => PlacedOrder | null;
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
        const parsed = JSON.parse(raw) as CartState;
        dispatch({ type: "hydrate", state: parsed });
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
  const clearBag = useCallback(() => dispatch({ type: "clear" }), []);
  const setDelivery = useCallback(
    (delivery: DeliveryDetails) => dispatch({ type: "setDelivery", delivery }),
    [],
  );

  const subtotalPence = useMemo(
    () => state.items.reduce((sum, i) => sum + i.pricePence * i.quantity, 0),
    [state.items],
  );

  const shippingPence = useMemo(() => {
    if (state.items.length === 0) return 0;
    return subtotalPence >= SHIPPING_FREE_THRESHOLD_PENCE
      ? 0
      : SHIPPING_FLAT_PENCE;
  }, [state.items.length, subtotalPence]);

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

  const placeOrder = useCallback((): PlacedOrder | null => {
    if (state.items.length === 0 || !state.delivery) return null;
    const order: PlacedOrder = {
      // Human-readable, sortable, low-collision id. Real ids come from API later.
      id: `UK-${Date.now().toString(36).toUpperCase()}`,
      placedAt: new Date().toISOString(),
      items: state.items,
      delivery: state.delivery,
      subtotalPence,
      shippingPence,
      totalPence,
    };
    dispatch({ type: "placeOrder", order });
    return order;
  }, [state.items, state.delivery, subtotalPence, shippingPence, totalPence]);

  const value: CartContextValue = {
    ...state,
    addItem,
    removeItem,
    setQuantity,
    clearBag,
    setDelivery,
    placeOrder,
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
