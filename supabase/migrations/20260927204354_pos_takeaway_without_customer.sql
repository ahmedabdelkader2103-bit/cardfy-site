-- Counter POS takeaway does not require customer identity. Keep the existing
-- creator as the source of truth and narrow only its takeaway validation to
-- non-POS sources. Delivery and every other creator rule remain unchanged.
do $migration$
declare
 function_source text;
 patched_source text;
 validation_pattern constant text :=
  $pattern$(if[[:space:]]+p_order[[:space:]]*->[[:space:]]*>[[:space:]]*'order_type'[[:space:]]*=[[:space:]]*'takeaway'[[:space:]]+and[[:space:]]+)(\([^;]*\)[[:space:]]+then[[:space:]]+raise[[:space:]]+exception[[:space:]]+'takeaway_details_required'[^;]*;)$pattern$;
 validation_matches integer;
begin
 select pg_get_functiondef(
  'public.cfy_menu_create_internal_order_v2(uuid,text,uuid,text,jsonb)'::regprocedure
 ) into function_source;

 select count(*) into validation_matches
 from regexp_matches(function_source,validation_pattern,'gi');

 if validation_matches<>1 then
  raise exception 'takeaway_validation_shape_mismatch:%',validation_matches;
 end if;

 patched_source:=regexp_replace(
  function_source,
  validation_pattern,
  $replacement$\1p_source is distinct from 'pos' and \2$replacement$,
  'gi'
 );

 if patched_source=function_source
    or position('takeaway_details_required' in lower(patched_source))=0
    or position($check$p_source is distinct from 'pos'$check$ in lower(patched_source))=0 then
  raise exception 'takeaway_validation_patch_not_applied';
 end if;

 execute patched_source;
end
$migration$;
