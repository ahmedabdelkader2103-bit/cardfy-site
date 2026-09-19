# CARDfy Analytics Expansion

The six new inner pages reuse the canonical Analytics shell, session, role permission,
date and branch filters. Stitch HTML was used as a visual reference only. No prototype
shell, mock values, logo, route, or inferred business rule is shipped.

Routes: `/analytics/kitchen`, `/analytics/customers`, `/analytics/insights`,
`/analytics/products`, `/analytics/order-types`, `/analytics/order-status`.

The new migration replaces the existing `cfy_os_analytics(text,date,date,uuid)`
function with the prior guarded implementation plus read-only aggregates. It changes
no table, row, grant, public endpoint, order action, or payment rule. Apply the initial
Analytics migration before this one. If a release must be rolled back, restore the
previous frontend and re-apply
`supabase/migrations/20260914170626_analytics_stitch_read_metrics.sql` as the
function definition. No customer or order data must be deleted.

Revenue and product sales still include only paid, non-cancelled orders. Customer
insights count only orders linked to the customer-account model, grouped by normalized
phone and returned as anonymous aggregates. This does not claim to cover POS customers.
Monthly repeat means registered customer accounts with two or more linked orders in
that selected month. Smart Insights are descriptive deterministic calculations, not
an AI production engine.

Per-item preparation times, station assignment, standard lateness thresholds, product
cost/margin, standardized cancellation categories and reliable time-in-status are not
recorded by the current model. The screens mark these indicators unavailable. Status
transition charts cover recorded order events only. Recent order tables are limited
to 50 rows and retain the selected branch/date scope.

Live release acceptance still requires deploying the frontend and applying both
Analytics migrations in order. Local browser fixtures are for responsive UI QA only.
