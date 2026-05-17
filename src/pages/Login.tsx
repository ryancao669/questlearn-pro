import { useState } from "react";
import { Coins, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
      extraParams: { prompt: "select_account" },
    });
    if (result.error) {
      setGoogleLoading(false);
      setError(result.error.message ?? "Google sign-in failed. Try again.");
      return;
    }
    // If redirected, browser is leaving the page. Otherwise session is set.
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    const domain = trimmed.split("@")[1];

    setSending(true);
    // Verify the domain belongs to a registered school
    const { data: schools, error: schoolErr } = await supabase
      .from("schools")
      .select("id,name,allowed_email_domains")
      .contains("allowed_email_domains", [domain]);

    if (schoolErr) {
      setSending(false);
      setError("Something went wrong. Please try again.");
      return;
    }
    if (!schools || schools.length === 0) {
      setSending(false);
      setError("Cash Quest isn't available at your school yet. Ask your teacher to request access.");
      return;
    }

    const { error: otpErr } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: window.location.origin },
    });
    setSending(false);
    if (otpErr) {
      setError(otpErr.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Coins className="h-10 w-10 text-secondary animate-coin-bounce" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary">Cash Quest</h1>
          <p className="text-muted-foreground text-sm mt-1">Financial literacy, gamified.</p>
        </div>

        {sent ? (
          <div className="rounded-xl border bg-card p-6 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-success mx-auto" />
            <h2 className="font-heading text-xl font-bold">Check your inbox</h2>
            <p className="text-sm text-muted-foreground">
              We sent a sign-in link to <span className="font-medium text-foreground">{email}</span>. Open it on this
              device to continue.
            </p>
            <button onClick={() => setSent(false)} className="text-xs text-primary underline">
              Use a different email
            </button>
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogle}
              disabled={googleLoading || sending}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? "Opening Google..." : "Continue with Google"}
            </Button>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-px bg-border flex-1" /> or email link <div className="h-px bg-border flex-1" />
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">School Email</label>
                <Input
                  type="email"
                  placeholder="you@school.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-base"
                  autoComplete="email"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full hotspot" disabled={sending || googleLoading}>
                <Mail className="mr-2 h-4 w-4" /> {sending ? "Sending..." : "Send Magic Link"}
              </Button>
            </form>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-4">
          Built by Ryan Cao • Original CashQuest creator
        </p>
      </div>
    </div>
  );
}
