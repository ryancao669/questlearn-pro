import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, LogIn, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "cashquest-user";

export interface CQUser {
  studentId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  idPhoto?: string; // data URL
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [studentId, setStudentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [idPhoto, setIdPhoto] = useState<string>("");
  const [error, setError] = useState("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setIdPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!studentId.trim()) {
      setError("Please enter your Student ID.");
      return;
    }
    if (!dob) {
      setError("Please enter your Date of Birth.");
      return;
    }
    if (!idPhoto) {
      setError("Please upload a photo of your student ID.");
      return;
    }

    const user: CQUser = {
      studentId: studentId.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName: `${firstName.trim()} ${lastName.trim()}`,
      idPhoto,
    };
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">First Name</label>
              <Input
                placeholder="First"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="text-base"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Last Name</label>
              <Input
                placeholder="Last"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="text-base"
              />
            </div>
          </div>
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
          <div>
            <label className="text-sm font-medium mb-1 block">Student ID Photo</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="hidden"
            />
            {idPhoto ? (
              <div className="relative rounded-lg border overflow-hidden">
                <img src={idPhoto} alt="Student ID preview" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => setIdPhoto("")}
                  className="absolute top-2 right-2 rounded-full bg-background/80 p-1 hover:bg-background"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" /> Upload / Take Photo
              </Button>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full hotspot">
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Milpitas High School • Financial Literacy Program
        </p>
      </div>
    </div>
  );
}
