CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_domain TEXT;
  v_school_id UUID;
  v_name TEXT;
  v_onboarded BOOLEAN;
BEGIN
  v_domain := lower(split_part(NEW.email, '@', 2));

  SELECT id INTO v_school_id
  FROM public.schools
  WHERE v_domain = ANY(allowed_email_domains)
  LIMIT 1;

  v_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    NULLIF(TRIM(CONCAT_WS(' ',
      NEW.raw_user_meta_data->>'given_name',
      NEW.raw_user_meta_data->>'family_name'
    )), '')
  );
  v_onboarded := v_name IS NOT NULL;

  INSERT INTO public.profiles (id, email, school_id, display_name, onboarded)
  VALUES (NEW.id, NEW.email, v_school_id, v_name, v_onboarded);

  IF v_school_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role, school_id)
    VALUES (NEW.id, 'student', v_school_id)
    ON CONFLICT DO NOTHING;

    INSERT INTO public.student_progress (user_id, school_id)
    VALUES (NEW.id, v_school_id)
    ON CONFLICT DO NOTHING;
  END IF;

  IF lower(NEW.email) IN ('rc92157@student.musd.org', 'matt@collegeboundnow.com') THEN
    INSERT INTO public.user_roles (user_id, role, school_id)
    VALUES (NEW.id, 'super_admin', NULL)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- Backfill: if Matt already signed up, grant super_admin now
INSERT INTO public.user_roles (user_id, role, school_id)
SELECT id, 'super_admin'::app_role, NULL
FROM auth.users
WHERE lower(email) = 'matt@collegeboundnow.com'
ON CONFLICT DO NOTHING;