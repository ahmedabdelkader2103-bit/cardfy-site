# CARDfy Professional Menu — Final Polish

This pass closes the remaining code-level gaps before the planned demo tenant is loaded for end-to-end acceptance.

## Completed in this pass

- Browser-side new-order sound opt-in and persistent visual new-order badge for the owner Orders Center.
- Staff order/update sound opt-in and payment-state visibility.
- Customer issue reporting from the secure order tracking link, stored as an order issue/event for restaurant follow-up.
- Cash V1 payment state made explicit in checkout, tracking, owner/staff order views and settings guidance.
- Cash collection becomes server-authoritative: delivery becomes paid when OTP delivery is confirmed; takeaway becomes paid when completed; dine-in remains paid when the table session is closed as paid.
- Analytics expanded with today's orders/revenue, open issues, paid/unpaid orders, rating count and payment-status breakdown.
- Existing public tracking now returns payment method/status without exposing hashes or private credentials.

## Internal verification

A transaction-scoped synthetic restaurant test was executed against live Supabase and rolled back. It verified:

1. Public takeaway order creation.
2. Secure public issue reporting using the tracking token.
3. Public tracking reflects issue state and cash payment state.
4. Owner lifecycle `new -> preparing -> ready -> completed` marks takeaway cash payment as paid.
5. Analytics returns the new payment metrics.
6. Rollback restored the clean database state.

After the test, production remains at zero CARDfy clients, zero legacy clients and zero Storage object metadata, ready for the single planned demo tenant.

## Remaining gate

No additional product coding is intentionally started before the demo data exists. The remaining release gate is the planned full demo tenant load followed by the documented end-to-end acceptance matrix in `PROFESSIONAL_MENU_ACCEPTANCE.md`.

Legacy root QR routing remains unchanged until a separate explicit cutover decision.
