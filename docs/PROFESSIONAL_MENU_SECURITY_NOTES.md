# Professional Menu Security Boundaries

- Owner access continues to use the CARDfy V2 client session and service scope.
- Staff uses separate short-lived custom PIN sessions scoped to one client and one operational role.
- Public menu/order endpoints enforce active client, active subscription and enabled Menu service.
- Price, discounts, coupon rules, delivery fees, variants and add-ons are recalculated server-side.
- Internal pricing/order helpers are not executable directly by anon/authenticated browser roles.
- Delivery OTP values are stored hashed.
- Tracking uses an opaque random token whose database value is hashed.
- Direct operational table access is protected; browser operations go through validated RPCs.
- Print failure never rolls back or invalidates an already saved order.
