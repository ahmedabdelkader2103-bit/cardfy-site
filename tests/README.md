# Batch 1 regression tests

Run `npm ci --ignore-scripts` then `npm test` using Node 22.21+ or Node 24.
Tests need no production keys, Supabase connection, Docker or customer data.

- `database.test.cjs`: real in-memory PostgreSQL (PGlite + pgcrypto), captured affected
  definitions and synthetic fixtures. The baseline security failures are reproduced first,
  then the exact migration file is applied and positive/negative cases run.
- `frontend.test.cjs`: actual HTML/JS in jsdom, mocked API transport, malicious text/URL
  cases, existing Legacy flows and payment-edit save/failure/refresh cases.
- `fixtures/`: read-only metadata captured from the audited schema. These are test inputs,
  not deployable schema backups or replacement authentication implementations.

The application remains a static HTML/JavaScript site. The Node packages are test tools only.
See `docs/AUDIT_BATCH_1_EXECUTION_REPORT.md` for coverage limits and pending acceptance.

## POS responsive browser regression

After building `pos-ui`, run `node --test tests/pos-responsive.browser.cjs` with
Playwright available to Node and its Chromium browser installed. Alternatively,
set `CARDFY_BROWSER_CHANNEL=msedge` to use installed Edge.
This is separate from the database/jsdom suite because it requires a real browser.

The test serves the real built POS with synthetic catalog/draft data, blocks remote
API access, and checks 48 viewport/mode/cart combinations. It covers the 1024px
width and 760px height boundaries, notes containment, checkout hierarchy, long
modifier/zone labels, cart-only scrolling, and extreme-height action reachability.
Set `CARDFY_POS_BASELINE` to an original HEAD's `restaurant/pos-ui` directory to
also compare normal desktop/mobile geometry and styling against that bundle.
Set `CARDFY_POS_SCREENSHOTS` to a directory outside the repository for screenshot
evidence. The fixture never creates an order or connects to Production.

Permission implementation references:
- [Supabase database function privileges](https://supabase.com/docs/guides/database/functions)
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
