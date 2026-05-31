import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface SchoolRow {
  id: string;
  name: string;
  slug: string;
  allowed_email_domains: string[];
}

export interface ProfileRow {
  id: string;
  email: string;
  school_id: string | null;
  display_name: string | null;
  student_id_number: string | null;
  onboarded: boolean;
}

const CREATOR_EMAILS = ["caoryan669@gmail.com"];
const STUDENT_VIEW_KEY = "creator_student_view";

interface AuthContextValue {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  school: SchoolRow | null;
  isCreator: boolean;
  studentView: boolean;
  toggleStudentView: () => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [school, setSchool] = useState<SchoolRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentView, setStudentView] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STUDENT_VIEW_KEY) === "1";
  });

  const toggleStudentView = useCallback(() => {
    setStudentView((v) => {
      const next = !v;
      try { window.localStorage.setItem(STUDENT_VIEW_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }, []);

  const isCreator = !!session?.user?.email && CREATOR_EMAILS.includes(session.user.email.toLowerCase());

  const loadProfile = useCallback(async (userId: string) => {
    const { data: prof } = await supabase
      .from("profiles")
      .select("id,email,school_id,display_name,student_id_number,onboarded")
      .eq("id", userId)
      .maybeSingle();
    setProfile(prof ?? null);
    if (prof?.school_id) {
      const { data: sch } = await supabase
        .from("schools")
        .select("id,name,slug,allowed_email_domains")
        .eq("id", prof.school_id)
        .maybeSingle();
      setSchool(sch ?? null);
    } else {
      setSchool(null);
    }
  }, []);

  useEffect(() => {
    // Listener FIRST (per Supabase auth best practice)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess?.user) {
        // Defer to avoid deadlock
        setTimeout(() => loadProfile(sess.user.id), 0);
      } else {
        setProfile(null);
        setSchool(null);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session: sess } }) => {
      setSession(sess);
      if (sess?.user) await loadProfile(sess.user.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    if (session?.user) await loadProfile(session.user.id);
  }, [session, loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loading, session, user: session?.user ?? null, profile, school, isCreator, studentView, toggleStudentView, refreshProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
