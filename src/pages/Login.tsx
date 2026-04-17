import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Coins, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "cashquest-user";

export interface CQUser {
  studentId: string;
  dob: string;
  displayName: string;
}

export function getCurrentUser(): CQUser | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEY);
}

// Mock student directory — in a real app this lives in the backend.
// Keyed by `${studentId}|${dob}` so login verifies both match.
export interface StudentRecord {
  firstName: string;
  lastName: string;
  idPhoto: string; // URL or data URL of student ID photo
}

export const STUDENT_DIRECTORY: Record<string, StudentRecord> = {
  "123456|2008-05-14": {
    firstName: "Ryan",
    lastName: "Cao",
    idPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
  },
  "234567|2007-09-02": {
    firstName: "Alex",
    lastName: "Nguyen",
    idPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
};

export function getStudentRecord(user: CQUser | null): StudentRecord | null {
  if (!user) return null;
  return STUDENT_DIRECTORY[`${user.studentId}|${user.dob}`] ?? null;
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

    const id = studentId.trim();
    const record = STUDENT_DIRECTORY[`${id}|${dob}`];
    const displayName = record ? `${record.firstName} ${record.lastName}` : `Student ${id}`;

    const user: CQUser = { studentId: id, dob, displayName };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Coins className="h-10 w-10 text-secondary animate-coin-bounce" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary">Cash Quest</h1>
          <p className="text-muted-foreground text-sm mt-1">Built by an MHS student</p>
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
          <p className="text-xs text-muted-foreground text-center pt-2">
            Demo: try ID <span className="font-mono">123456</span> / DOB <span className="font-mono">2008-05-14</span>
          </p>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Milpitas High School • Financial Literacy Program
        </p>
      </div>
    </div>
  );
}
