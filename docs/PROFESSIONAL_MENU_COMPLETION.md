# CARDfy Professional Menu — Completion Scope

This branch completes the agreed Professional Menu implementation on top of the existing CARDfy V2 foundation.

## Included

- Customer public menu, responsive RTL, themes and layout presets
- Categories, products, variants and reusable add-ons
- Product discounts and coupons
- Delivery zones, minimum order and ETA
- Server-authoritative quote and order pricing
- Delivery / takeaway / dine-in checkout
- Opening hours and scheduled ordering
- Order tracking, OTP confirmation and feedback
- Restaurant / cafe / hybrid operating modes
- Permanent table QR + temporary table sessions + bill request + close paid
- Unified order sources: online, POS and phone
- Owner orders view and touch-first POS
- Staff PIN sessions for cashier, coordinator and delivery roles
- Delivery assignment and driver mini workflow
- Kitchen/cashier print queue, reprint and failure-safe order persistence
- Operational settings, staff/table management and analytics

## Compatibility

- Existing CARDfy V2 account/session/subscription foundation is preserved.
- Root legacy `index.html` and `404.html` QR routing are not changed by this completion branch.
- The new menu is served under `/menu/` until a deliberate public QR cutover is approved.

## Printing note

Browser printing is the safe fallback. True silent auto-print requires an optional local print bridge; print failure never invalidates or rolls back an order.
