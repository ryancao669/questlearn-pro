import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useProgress } from "@/hooks/useProgress";
import { getCurrentUser } from "@/pages/Login";
import AppNavbar from "@/components/AppNavbar";
import Index from "./pages/Index";
import Lessons from "./pages/Lessons";
import LessonView from "./pages/LessonView";
import Progress from "./pages/Progress";
import Rewards from "./pages/Rewards";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppContent() {
  const { progress } = useProgress();
  const user = getCurrentUser();

  return (
    <>
      {user && <AppNavbar knowledgePoints={progress.knowledgePoints} redeemablePoints={progress.redeemablePoints} showHotspots />}
      <Routes>
        <Route path="/login" element={<Login />} />
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
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
