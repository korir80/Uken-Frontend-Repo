import { api } from "./api";
import type { PaymentInitResponse } from "../types/api";

export const paymentService = {
  initiate: (orderId: string, buyerId: string) =>
    api.post<PaymentInitResponse>("/payments/initiate", { orderId, buyerId }),
};
