# CARDfy Analytics — approved Stitch integration

The six Analytics pages reuse the existing Restaurant OS shell, wordmark, session, permissions and navigation. Approved Stitch card surfaces, grid proportions, palette and Arabic typography are retained. The reference HTML prototypes and their static values are not shipped.

Routes: `/analytics`, `/analytics/revenue`, `/analytics/order-sources`, `/analytics/drivers`, `/analytics/categories`, `/analytics/peak-hours`. Existing `restaurant/?page=analytics-*` links redirect to these routes and preserve staff mode. Dates/branch carry through drill-down links.

Build: `npm ci --ignore-scripts --prefix analytics-ui`, then `npm run build --prefix analytics-ui`. Relevant regression checks: `node --test tests/analytics-stitch.test.cjs`.

Data: existing `cfy_os_analytics(text,date,date,uuid)` with the same paid/non-cancelled revenue calculation, Cairo dates and branch/tenant/permission checks. The additive migration `20260914170626_analytics_stitch_read_metrics.sql` adds product ranking, source trends, delivery trends, active-driver count, current shift states, paid daily counts and preparation by hour. It changes no tables, stored data or function grants. Apply it before release; restore `analytics-ui/rollback.sql` to roll back the function. Older API responses remain readable with unavailable additional metrics.

Not recorded by the current backend: net collection after fees/refunds, visit-to-order conversion, restaurant return events, shift durations, pause durations, kitchen-line events and repeated-customer statistics. These are explicitly unavailable; they are not simulated. Active-driver status is restaurant-wide, since drivers have no branch assignment field.

Visual QA used a local-only boundary outside this repository, including long Arabic driver names, empty data, errors and desktop/tablet/mobile dimensions. Production auth/order/payment flows were not mutated during Analytics QA. Live acceptance and the database migration remain separate release steps.
