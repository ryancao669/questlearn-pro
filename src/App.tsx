import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useProgress } from "@/hooks/useProgress";
import AppNavbar from "@/components/AppNavbar";
import Index from "./pages/Index";
import Lessons from "./pages/Lessons";
import LessonView from "./pages/LessonView";
import Progress from "./pages/Progress";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { progress } = useProgress();
  return (
    <>
      <AppNavbar knowledgePoints={progress.knowledgePoints} redeemablePoints={progress.redeemablePoints} showHotspots />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lessons/:id" element={<LessonView />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/rewards" element={<Rewards />} />
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
