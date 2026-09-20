# Kitchen UI to production mapping

- Approved `KitchenHeader` maps into the existing Restaurant OS shell; CARDfy auth, navigation, identity, theme and logout remain owned by `shared.js`.
- Lovable filter tabs map to client-side filtering of the real `cfy_os_operational_snapshot` response.
- Mock Kitchen cards map to real orders whose status is `preparing`; `new` Delivery/Takeaway orders remain in Order Prep until acceptance.
- Product, variant, option/add-on and note labels come from each real order-item snapshot.
- The waiting clock starts at `preparing_at`, then `accepted_at`, then `created_at` as a compatibility fallback.
- `تم التحضير` calls the existing token-gated `cfy_os_order_action` with page `kitchen` and action `ready`. The existing order workflow then exposes the ready order to Hall/Order Prep according to its type.
- Printing reuses the existing browser print path. No printer integration or database behavior was added.
- No Lovable mock orders, shell, routing, permissions or business logic are copied.
