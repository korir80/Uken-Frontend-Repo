import { createFileRoute, Navigate } from "@tanstack/react-router";

/**
 * The payment step is now hosted by Stripe — we no longer collect card
 * details in-app. The delivery step creates the order, initiates payment,
 * and redirects directly to the gateway. This route is kept only so old
 * links don't 404 — it bounces back to the delivery step.
 */
export const Route = createFileRoute("/checkout/payment")({
  component: () => <Navigate to="/checkout/delivery" replace />,
});
