# CARDfy Architecture V2

Branch: `codex-transfer-phase1`

This document is the implementation source of truth for the Claude -> ChatGPT transfer phase.

## Product model

One CARDfy account per client. The client code identifies the client, not a service. Services are activated independently through `cfy_client_services`.

Current services:
- Social Link
- Professional Menu
- Professional Shop
- Professional Booking

The Admin dashboard manages client identity, subscription, account/password and service activation only. Service-specific content belongs in each service dashboard.

## Core client/account architecture

Tables:
- `cfy_clients`
- `cfy_client_services`
- `cfy_social_data`
- `cfy_client_sessions`
- `cfy_admin_users`
- `cfy_login_rate_limits`

Legacy `clients` is intentionally retained for rollback/compatibility during migration, but the V2 Admin uses the new tables/RPCs.

Client passwords are bcrypt hashes via pgcrypto. The original password cannot be retrieved. Admin can reset it. Client sessions are random tokens stored only as SHA-256 hashes in the database.

Login has persistent per-code rate limiting: 5 failed attempts within 15 minutes causes a 15-minute temporary block.

Admin-only RPCs verify membership in `cfy_admin_users`. Anonymous users cannot execute Admin RPCs.

Admin can open a temporary 2-hour client session through `cfy_admin_create_client_session` without knowing the client's password.

## Client frontend

- `/client-dashboard.html` — account login and activated-service launcher.
- `/dashboard/social/` — Social Link management shell using token-protected Social RPCs.
- `/dashboard/menu/` — Menu backend-connected status shell; full Menu management UI intentionally deferred.
- `/dashboard/shop/` — Shop backend-connected status shell; full Shop management UI intentionally deferred.
- `/dashboard/booking/` — Booking backend-connected status shell; full Booking management UI intentionally deferred.
- `/dashboard-v2/` — V2 Admin frontend connected to V2 Admin RPCs.

## Booking backend

Tables:
- `cfy_booking_data`
- `cfy_booking_services`
- `cfy_booking_schedules`
- `cfy_booking_blocks`
- `cfy_bookings`
- `cfy_booking_assets`

Important behavior:
- Public booking profile is returned through RPC, not direct public table reads.
- `reason_private` on booking blocks is never exposed through public availability/profile RPCs.
- Availability excludes any time-range overlap, not only identical start times.
- PostgreSQL exclusion constraint `cfy_bookings_no_overlap` provides database-level race-condition protection for pending/confirmed bookings.
- Booking statuses: pending, confirmed, rejected, cancelled, completed.
- Booking attachments use the private Storage bucket.

RPCs include public profile, available slots, booking creation, client booking list/status management, management snapshot and CRUD mutation endpoints.

## Storage

Buckets:
- `cardfy-public` — public images for Social/Menu/Shop assets. 10 MB limit and image MIME allowlist.
- `cardfy-private` — private Booking attachments. 15 MB limit, image/PDF allowlist.

Edge Functions:
- `cardfy-upload` — validates the custom CARDfy client session and enabled service, enforces MIME/size/path ownership, uploads to the correct bucket and records Booking attachment metadata.
- `cardfy-private-asset-url` — creates short-lived signed URLs for private Booking assets after token/path ownership validation.
- `cardfy-delete-asset` — validates client ownership before deleting an asset.

## Professional Menu backend

Core tables:
- `cfy_menu_settings`
- `cfy_menu_categories`
- `cfy_menu_products`
- `cfy_menu_product_discounts`
- `cfy_menu_coupons`
- `cfy_menu_delivery_zones`
- `cfy_menu_orders`
- `cfy_menu_order_items`

Shared Product Options Engine:
- `cfy_product_variants`
- `cfy_product_option_groups`
- `cfy_product_options`

Supported foundations include category images, products, variants/sizes, required/optional modifier groups, min/max selection rules, add-on prices, product discounts, coupons, delivery zones/fees/minimums, dynamic order types, closed-restaurant order prevention, order snapshots, and order statuses.

Menu order statuses: new -> confirmed -> preparing -> ready -> completed, with cancelled as an exception.

`cfy_menu_create_order` recalculates product/variant/add-on prices and discounts on the server instead of trusting browser totals. Orders are persisted before any future WhatsApp/POS integration.

Client management RPCs provide a management snapshot and CRUD mutation surface for settings/categories/products/variants/options/coupons/delivery zones.

## Professional Shop backend

Core tables:
- `cfy_shop_settings`
- `cfy_shop_categories`
- `cfy_shop_products`
- `cfy_shop_product_discounts`
- `cfy_shop_customers`
- `cfy_shop_carts`
- `cfy_shop_cart_items`
- `cfy_shop_orders`
- `cfy_shop_order_items`

Shop reuses the shared Product Options Engine.

Foundations include products/categories/images/gallery, SKU, optional stock tracking, variants/options, carts, customers, order persistence, fulfillment types, discounts and order snapshots.

`cfy_shop_create_order` recalculates pricing server-side and atomically decrements tracked inventory while creating the order.

Client management RPCs provide a management snapshot and CRUD mutation surface for settings/categories/products/variants/options/discounts.

## Security/RLS

All V2 service tables have RLS enabled. Direct client-browser access is not used for custom client accounts; client operations go through token-validating SECURITY DEFINER RPCs with explicit search paths.

Admin RPCs are executable only by the authenticated role and also call `cfy_is_admin()` internally.

`cfy_client_sessions` and `cfy_login_rate_limits` have explicit deny-direct-access RLS policies and are accessed only by trusted RPCs.

Public SECURITY DEFINER RPCs are intentional where the operation must work for guests or CARDfy's custom client session model. Each such RPC limits returned data and validates client/service/token ownership where required.

## Internal verification completed

Successful transactional tests:
- client login + four-service visibility + persistent rate limit
- Booking slot generation + interval overlap exclusion + database overlap constraint + block privacy
- Menu order engine: product discount + coupon + immutable order snapshot + total calculation
- Shop order engine: product discount + delivery fee + inventory decrement + customer persistence
- Admin RPC execution under the real authenticated Admin identity: client list and sequential next code (`QBL-0006` at the time of test)
- Admin RPC ACL check: anonymous execution denied for Admin list/save/client-session functions
- Storage buckets exist with expected public/private mode, size limits and MIME restrictions
- Storage Edge Functions are deployed and ACTIVE

## Migrations applied to the live Cardfy Supabase project

- `cardfy_core_schema_v1`
- `cardfy_core_rpcs_v1`
- `cardfy_admin_client_rpcs_v1`
- `cardfy_security_hardening_v1c`
- `cardfy_booking_architecture_v1`
- `cardfy_storage_buckets_v1`
- `cardfy_menu_architecture_v1`
- `cardfy_shop_architecture_v1`
- `cardfy_login_rate_limit_fix_v1`
- `cardfy_booking_function_search_path_fix`
- `cardfy_security_advisor_cleanup_v1`
- `cardfy_client_service_management_rpcs_v1`
- `cardfy_shop_booking_management_rpcs_v1`

## Deployment safety

The GitHub `main` branch has not been replaced with V2 Admin routing during implementation. Development work is isolated on `codex-transfer-phase1`. Promotion/merge should happen only after the final transfer review and the user's acceptance test.

The legacy `clients` table remains present for rollback and public-page compatibility during this phase. It should not be deleted until the public page is migrated and a final migration/reconciliation check is complete.
