import { useState } from "react";
import { Coins, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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
          <form onSubmit={handleLogin} className="rounded-xl border bg-card p-6 space-y-4">
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
              <p className="text-xs text-muted-foreground mt-1">
                We'll email you a one-time link. No password to remember.
              </p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full hotspot" disabled={sending}>
              <Mail className="mr-2 h-4 w-4" /> {sending ? "Sending..." : "Send Magic Link"}
            </Button>
          </form>
        )}

        <p className="text-xs text-muted-foreground text-center mt-4">
          Built by Ryan Cao • Original CashQuest creator
        </p>
      </div>
    </div>
  );
}
