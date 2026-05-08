REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.user_school_id(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_school_staff(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_school_id(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_school_staff(uuid, uuid) TO authenticated;