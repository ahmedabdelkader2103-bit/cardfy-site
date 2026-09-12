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

Permission implementation references:
- [Supabase database function privileges](https://supabase.com/docs/guides/database/functions)
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
