import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "cashquest-user";

export interface CQUser {
  studentId: string;
  displayName: string;
}

export function getCurrentUser(): CQUser | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEY);
}

export default function Login() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!studentId.trim()) {
      setError("Please enter your Student ID.");
      return;
    }
    if (!dob) {
      setError("Please enter your Date of Birth.");
      return;
    }

    // For prototype: accept any student ID + DOB combo
    const user: CQUser = {
      studentId: studentId.trim(),
      displayName: `Student ${studentId.trim()}`,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Coins className="h-10 w-10 text-secondary animate-coin-bounce" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary">Cash Quest</h1>
          <p className="text-muted-foreground text-sm mt-1">Built by an MHS student 💙💛</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-xl border bg-card p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Student ID</label>
            <Input
              placeholder="e.g. 123456"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="text-base"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Date of Birth</label>
            <Input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              className="text-base"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full hotspot">
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Malverne High School • Financial Literacy Program
        </p>
      </div>
    </div>
  );
}
