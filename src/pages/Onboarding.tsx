import { useState } from "react";
import { Coins, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function Onboarding() {
  const { user, profile, school, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.display_name ?? "");
  const [studentId, setStudentId] = useState(profile?.student_id_number ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Please enter your name so classmates and teachers can recognize you.");
      return;
    }
    if (!user) return;
    setSaving(true);
    const { error: upErr } = await supabase
      .from("profiles")
      .update({
        display_name: name.trim(),
        student_id_number: studentId.trim() || null,
        onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setSaving(false);
    if (upErr) {
      setError(upErr.message);
      return;
    }
    await refreshProfile();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Coins className="h-10 w-10 text-secondary mx-auto animate-coin-bounce" />
          <h1 className="font-heading text-2xl font-bold mt-3">Welcome to Cash Quest</h1>
          {school && <p className="text-sm text-muted-foreground mt-1">{school.name}</p>}
        </div>
        <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Your Name</label>
            <Input
              placeholder="e.g. Ryan Cao"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-1">Shown on the leaderboard.</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Student ID <span className="text-muted-foreground font-normal">(optional)</span></label>
            <Input
              placeholder="e.g. 123456"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full hotspot" disabled={saving}>
            {saving ? "Saving..." : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
