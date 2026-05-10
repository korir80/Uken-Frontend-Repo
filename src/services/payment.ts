import { api } from "./api";
import type { PaymentInitResponse } from "../types/api";
// UKENA-PAYMENT-SERVICE-V2 - buyerId added 2026-05-10
export const paymentService = {
  initiate: (orderId: string, buyerId: string) =>
    api.post<PaymentInitResponse>("/payments/initiate", { orderId, buyerId }),
};
