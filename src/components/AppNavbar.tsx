import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Trophy, Gift, BarChart3, Home, Coins, Users, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AppNavbarProps {
  knowledgePoints: number;
  redeemablePoints: number;
  showHotspots?: boolean;
}

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/lessons", icon: BookOpen, label: "Lessons" },
  { to: "/leaderboard", icon: Users, label: "Ranks" },
  { to: "/progress", icon: BarChart3, label: "Progress" },
  { to: "/rewards", icon: Gift, label: "Rewards" },
];

export default function AppNavbar({ knowledgePoints, redeemablePoints, showHotspots }: AppNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, school } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
          <Coins className="h-6 w-6 text-secondary animate-coin-bounce" />
          Cash Quest
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${showHotspots ? "hotspot" : ""}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm font-medium" title="Knowledge Points (permanent)">
            <Trophy className="h-4 w-4 text-secondary" />
            <span>{knowledgePoints} KP</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full gold-gradient text-secondary-foreground text-sm font-semibold" title="Redeemable Points (spendable)">
            <Coins className="h-4 w-4" />
            <span>{redeemablePoints} RP</span>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors" title="Sign Out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur">
        <div className="flex justify-around py-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                } ${showHotspots ? "hotspot" : ""}`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
