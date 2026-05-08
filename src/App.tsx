import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import AppNavbar from "@/components/AppNavbar";
import Index from "./pages/Index";
import Lessons from "./pages/Lessons";
import LessonView from "./pages/LessonView";
import Progress from "./pages/Progress";
import Rewards from "./pages/Rewards";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, user, profile } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (profile && !profile.onboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AppContent() {
  const { user, profile } = useAuth();
  const { progress } = useProgress();
  const showNavbar = !!user && !!profile?.onboarded;

  return (
    <>
      {showNavbar && <AppNavbar knowledgePoints={progress.knowledgePoints} redeemablePoints={progress.redeemablePoints} showHotspots />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/login" replace />} />
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
        <Route path="/lessons/:id" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
