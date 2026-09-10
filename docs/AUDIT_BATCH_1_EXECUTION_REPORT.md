# CARDfy — Audit Batch 1 Execution Report

Date: 2026-09-10. Base commit: `dad906ce23cb176cca0b0acf916d6c166a6dea22`.
Local branch: `codex/audit-batch-1`.

## Status

Implementation and local regression tests: completed.
Overall operational closure: **Partially Completed / Closed: NO**.
The source changes and SQL migration are prepared locally. Nothing has been pushed,
deployed, or applied to production. Production still has the audited behavior.
The remaining audit findings are deliberately outside this batch.

## Approved fixes

| Issue | Change | Verification |
|---|---|---|
| Public finalizer | Revoke EXECUTE from PUBLIC/anon/authenticated. Derive free-delivery total from stored subtotal/product discount instead of subtracting delivery repeatedly. Skip mutation for duplicate, progressed or paid orders. | Reproduce original repeated discount in isolated PostgreSQL; reject direct calls after migration; repeated internal calls retain total; all three existing V3 wrappers retain nested execution permission. |
| Legacy write authorization | Existing write policies require `cfy_is_admin()`, with USING/WITH CHECK as appropriate; existing public reads remain. Revoke TRUNCATE, which bypasses RLS, from public browser roles. | Anonymous/non-admin inserts denied, updates/deletes affect zero rows, TRUNCATE denied. Existing allowlisted admin can insert/update/delete clients and save settings. Real Core/Social sync trigger definitions still work in the local fixture. |
| Stored XSS in audited renderers | Escape names, tagline, labels, captions and client identity fields; validate link/image/design values. Store payment-copy values in data attributes instead of interpolating them into JavaScript handlers. | DOM tests with HTML, attribute and handler payloads; normal Arabic content, links, logo, gallery/lightbox, copy handler, expired page and enabled-service navigation. |
| Driver issue permission | Delivery actor must match the non-null assigned driver on a delivery order before the `issue` mutation/response. | Reject another driver, unassigned order, null actor, non-delivery order and wrong restaurant. Assigned driver/owner/cashier/coordinator retain their allowed action. No event or order change after rejected actions. |
| Payment-method edits | Render on form load/explicit refresh and save through General settings. Remove periodic field rebuilding and broad RPC interception. | Edits survive five timer callbacks, save/reload correctly, remain after failed save, and are not accidentally saved by the printing-settings action. |

## Tests

`npm test`: **20 passed, 0 failed** on Node 22.23.2.
`git diff --check`: passed (Git reports ordinary LF/CRLF normalization warnings).

Tests use pinned development-only PGlite 0.5.8 and jsdom 30.0.1 with a lockfile.
They add no frontend runtime dependency. A pull-request/manual CI workflow runs the same suite;
the remote workflow has not been run because this branch has not been pushed.

The SQL fixture uses captured affected table columns/defaults, function definitions,
Legacy policies and sync triggers, with synthetic data only. It is not a full production clone:
unrelated foreign keys, triggers and authentication flows are not reproduced. The three V3
creation wrappers are real; their upstream creators are stubbed to isolate nested execution
permission. These checks must not be described as full checkout, Owner/Staff login or OTP E2E.
Frontend tests exercise real application scripts in jsdom with mocked RPC responses, not a
physical device/browser acceptance session.

## Side effects, risks and new findings

No regressions appeared within the exercised Legacy and Professional Menu paths.
The review additionally confirmed TRUNCATE grants on the same two Legacy tables; their
removal belongs to the approved Legacy permission repair. No unrelated fixes were started.
Existing data was not rewritten or cleaned. There is no claim that historical totals affected
by an exploit have been repaired; a data investigation would be a separate approved step.

## Pending acceptance / release

1. Review the four changed frontend files and the batch SQL migration.
2. Test on an approved staging environment with the existing schema and valid Admin,
   Owner, Staff and driver sessions. Confirm the real Admin account is in `cfy_admin_users`.
3. Obtain deployment approval before applying the migration or publishing the frontend.
4. Verify public creation, Owner/Staff creation, assigned/unassigned driver actions,
   Legacy QR/synchronization and saved payment settings against the deployed version.

The migration is a targeted patch against the audited existing database, not a schema baseline.
Do not use it to initialize an empty production/staging project. It runs transactionally and
was applied twice successfully in the isolated test database. No production rollback was run;
do not restore the original public finalizer permissions as an automatic rollback.

**Ready for Marketing: NO.** Existing critical behavior remains live until an approved release;
other audit batches and full acceptance also remain pending.

## Management Update

تم تنفيذ الإصلاحات الخمسة المعتمدة محليًا وتجهيز Migration دون تعديل Production أو نشر.
نجح 20 اختبارًا محليًا يغطي الدالة الحرجة وصلاحيات Legacy والمندوب وStored XSS وإعدادات الدفع،
ولم يظهر أثر جانبي داخل نطاق الاختبارات. إغلاق المجموعة تشغيليًا ما زال معلقًا على اعتماد
النشر واختبار القبول بجلسات فعلية. Closed: NO — Ready for Marketing: NO.
لم يبدأ العمل على المجموعة التالية.
