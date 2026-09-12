-- Trigger functions are invoked by PostgreSQL triggers and must never be callable
-- through the exposed API roles.
revoke execute on function public.cfy_delete_legacy_client() from public, anon, authenticated;
revoke execute on function public.cfy_sync_core_to_legacy() from public, anon, authenticated;
revoke execute on function public.cfy_sync_social_to_legacy() from public, anon, authenticated;

