import { api } from "./api";
import type { PaymentInitResponse } from "../types/api";

/**
 * POST /payments/initiate — public.
 *   - Logged-in buyer: send JWT header, body { orderId }.
 *   - Guest: no auth header, body { orderId, guestEmail }.
 */
export const paymentService = {
  initiate: (orderId: string, guestEmail?: string) =>
    api.post<PaymentInitResponse>(
      "/payments/initiate",
      guestEmail ? { orderId, guestEmail } : { orderId },
    ),
};
