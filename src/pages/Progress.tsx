import { Trophy, Star, Flame, BookOpen, Coins } from "lucide-react";
import { lessons } from "@/data/lessons";
import { useProgress } from "@/hooks/useProgress";

export default function Progress() {
  const { progress } = useProgress();
  const completionPercent = Math.round((progress.completedLessons.length / lessons.length) * 100);

  return (
    <div className="container py-8 pb-24 md:pb-8 animate-slide-up">
      <h1 className="font-heading text-3xl font-bold mb-6">Your Progress</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Knowledge Points", value: progress.knowledgePoints, icon: Star, color: "text-secondary", desc: "Permanent — tracks your learning" },
          { label: "Redeemable Points", value: progress.redeemablePoints, icon: Coins, color: "text-secondary", desc: "Spendable in rewards store" },
          { label: "Lessons Completed", value: progress.completedLessons.length, icon: BookOpen, color: "text-primary", desc: `Out of ${lessons.length} total` },
          { label: "Day Streak", value: progress.currentStreak, icon: Flame, color: "text-destructive", desc: "Keep it going!" },
        ].map(({ label, value, icon: Icon, color, desc }) => (
          <div key={label} className="rounded-xl border bg-card p-4">
            <Icon className={`h-5 w-5 ${color} mb-2`} />
            <p className="text-2xl font-bold font-heading">{value}</p>
            <p className="text-xs font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      <div className="rounded-xl border bg-card p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-semibold">Course Completion</h3>
          <span className="text-sm font-medium">{completionPercent}%</span>
        </div>
        <div className="h-4 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full gold-gradient transition-all duration-500" style={{ width: `${completionPercent}%` }} />
        </div>
      </div>

      {/* Per-Lesson Results */}
      <h3 className="font-heading text-xl font-semibold mb-4">Lesson Results</h3>
      <div className="space-y-3">
        {lessons.map(lesson => {
          const completed = progress.completedLessons.includes(lesson.id);
          const score = progress.quizScores[lesson.id];
          return (
            <div key={lesson.id} className={`rounded-lg border p-4 flex items-center justify-between ${completed ? "bg-success/5" : "bg-muted/30"}`}>
              <div>
                <p className="font-medium text-sm">Lesson {lesson.id}: {lesson.title}</p>
                <p className="text-xs text-muted-foreground">{lesson.category}</p>
              </div>
              {completed ? (
                <div className="text-right">
                  <p className="text-sm font-semibold text-success">✓ Complete</p>
                  <p className="text-xs text-muted-foreground">Quiz: {score}%</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Not started</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Points Explainer */}
      <div className="mt-8 rounded-xl border bg-muted/50 p-5">
        <h3 className="font-heading font-semibold mb-2">How Points Work</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium flex items-center gap-1"><Star className="h-4 w-4 text-secondary" /> Knowledge Points (KP)</p>
            <p className="text-muted-foreground">Permanent points that track your overall learning progress. They never go down!</p>
          </div>
          <div>
            <p className="font-medium flex items-center gap-1"><Coins className="h-4 w-4 text-secondary" /> Redeemable Points (RP)</p>
            <p className="text-muted-foreground">Spendable points you can use in the Rewards Store. They decrease when you redeem rewards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
