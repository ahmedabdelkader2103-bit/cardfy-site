# Approved Delivery frontend integration

Presentation source: `ahmedabdelkader2103-bit/cardfy-delivery-ui`, commit `05b61700162ba1fee040b65af258cd56f3deb5f9`. Approved components and design tokens are retained. TanStack server/router scaffolding is replaced with an ES module entry for CARDfy's existing static hosting.

Build with `npm ci --ignore-scripts` and `npm run build` in this directory. Output is `restaurant/delivery-ui/entry.js` and `main.css`. The existing authenticated `/restaurant/?page=delivery&as=staff` route mounts this interface for the delivery role. Owner operations remain in the existing interface.

The mount receives CARDfy's existing session and RPC boundary. Orders come from `cfy_os_operational_snapshot`; actions use `cfy_os_order_action`; availability uses `cfy_menu_staff_shift`. No session replacement or client-side permission grants are introduced. Backend responses control completion and payment state.

Prototype orders, driver statistics, local OTP comparison and simulated customer replies are removed. The six-digit OTP inputs match CARDfy's production contract. Exception reasons and explicit delivery attestation are submitted to the existing backend, with independent customer receipt confirmation in public tracking.

Queue metadata uses an optional, separately approved `cfy_os_driver_queue` read API. Until deployed, its position is shown as unavailable; order operations still work. This projection follows existing assignment ordering and returns only the requesting driver's position and total available drivers. The migration contains its rollback command. No table changes or data writes are required.

Distances and shift start times are displayed as unavailable when there is no reliable source. The nearby filter never guesses a customer's distance. Maps uses the actual address; monetary labels use the stored payment method and state.

Frontend rollback: restore the previous Restaurant OS application release and its consistent version tags. Queue rollback: drop only the new read function; the frontend tolerates its absence. Existing order actions and data remain unchanged.
