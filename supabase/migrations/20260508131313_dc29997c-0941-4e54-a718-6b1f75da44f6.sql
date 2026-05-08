-- ============ SCHOOLS ============
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  allowed_email_domains TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- ============ ROLES ENUM ============
CREATE TYPE public.app_role AS ENUM ('super_admin', 'school_admin', 'teacher', 'student');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  student_id_number TEXT,
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role, school_id)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============ STUDENT PROGRESS ============
CREATE TABLE public.student_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  knowledge_points INTEGER NOT NULL DEFAULT 0,
  redeemable_points INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  last_completed_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- ============ LESSON COMPLETIONS ============
CREATE TABLE public.lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL,
  quiz_score INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;

-- ============ REWARD REDEMPTIONS ============
CREATE TABLE public.reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  reward_id INTEGER NOT NULL,
  cost INTEGER NOT NULL,
  fulfillment_status TEXT NOT NULL DEFAULT 'pending',
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

-- ============ SECURITY DEFINER HELPERS ============
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.user_school_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT school_id FROM public.profiles WHERE id = _user_id;
$$;

CREATE OR REPLACE FUNCTION public.is_school_staff(_user_id UUID, _school_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND school_id = _school_id
      AND role IN ('school_admin','teacher')
  );
$$;

-- ============ RLS POLICIES ============

-- schools: any authenticated user can read (needed for domain routing during onboarding)
CREATE POLICY "schools_read_all_auth" ON public.schools FOR SELECT TO authenticated USING (true);
CREATE POLICY "schools_super_admin_all" ON public.schools FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- profiles: own profile, plus same-school staff/super_admin read
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid()
    OR public.has_role(auth.uid(), 'super_admin')
    OR public.is_school_staff(auth.uid(), school_id));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_super_admin_all" ON public.profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- user_roles: user can read own roles; super_admin manages
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "user_roles_super_admin_all" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- student_progress: own row read/write; staff read same-school
CREATE POLICY "progress_select_own_or_staff" ON public.student_progress FOR SELECT TO authenticated
  USING (user_id = auth.uid()
    OR public.has_role(auth.uid(), 'super_admin')
    OR public.is_school_staff(auth.uid(), school_id));
CREATE POLICY "progress_insert_own" ON public.student_progress FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND school_id = public.user_school_id(auth.uid()));
CREATE POLICY "progress_update_own" ON public.student_progress FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- lesson_completions
CREATE POLICY "completions_select_own_or_staff" ON public.lesson_completions FOR SELECT TO authenticated
  USING (user_id = auth.uid()
    OR public.has_role(auth.uid(), 'super_admin')
    OR public.is_school_staff(auth.uid(), school_id));
CREATE POLICY "completions_insert_own" ON public.lesson_completions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND school_id = public.user_school_id(auth.uid()));

-- reward_redemptions
CREATE POLICY "redemptions_select_own_or_staff" ON public.reward_redemptions FOR SELECT TO authenticated
  USING (user_id = auth.uid()
    OR public.has_role(auth.uid(), 'super_admin')
    OR public.is_school_staff(auth.uid(), school_id));
CREATE POLICY "redemptions_insert_own" ON public.reward_redemptions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND school_id = public.user_school_id(auth.uid()));

-- For staff leaderboard scope: leaderboard query needs to read other students' progress in same school -- already covered above.
-- Students need to see classmates on leaderboard. Add policy:
CREATE POLICY "progress_leaderboard_same_school" ON public.student_progress FOR SELECT TO authenticated
  USING (school_id = public.user_school_id(auth.uid()));
CREATE POLICY "profiles_leaderboard_same_school" ON public.profiles FOR SELECT TO authenticated
  USING (school_id = public.user_school_id(auth.uid()));

-- ============ NEW USER TRIGGER ============
-- Routes new auth.users into the right school by email domain, creates profile,
-- assigns student role (and super_admin if email matches the bootstrap address).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_domain TEXT;
  v_school_id UUID;
BEGIN
  v_domain := lower(split_part(NEW.email, '@', 2));

  SELECT id INTO v_school_id
  FROM public.schools
  WHERE v_domain = ANY(allowed_email_domains)
  LIMIT 1;

  INSERT INTO public.profiles (id, email, school_id, onboarded)
  VALUES (NEW.id, NEW.email, v_school_id, false);

  IF v_school_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role, school_id)
    VALUES (NEW.id, 'student', v_school_id)
    ON CONFLICT DO NOTHING;

    INSERT INTO public.student_progress (user_id, school_id)
    VALUES (NEW.id, v_school_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Bootstrap super admin
  IF lower(NEW.email) = 'rc92157@student.musd.org' THEN
    INSERT INTO public.user_roles (user_id, role, school_id)
    VALUES (NEW.id, 'super_admin', NULL)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SEED ============
INSERT INTO public.schools (name, slug, allowed_email_domains)
VALUES ('Milpitas High School', 'mhs', ARRAY['student.musd.org']);
