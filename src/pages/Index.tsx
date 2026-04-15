import { Link } from "react-router-dom";
import { BookOpen, Trophy, Gift, Flame, ArrowRight, Coins, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lessons } from "@/data/lessons";
import { useProgress } from "@/hooks/useProgress";

export default function Index() {
  const { progress, isLessonUnlocked, isLessonCompleted } = useProgress();

  // Find lesson of the day: first uncompleted lesson
  const lessonOfTheDay = lessons.find(l => !isLessonCompleted(l.id) && isLessonUnlocked(l.id)) || lessons[0];
  const completionPercent = Math.round((progress.completedLessons.length / lessons.length) * 100);

  return (
    <div className="container py-8 pb-24 md:pb-8 space-y-8 animate-slide-up">
      {/* Hero */}
      <div className="rounded-2xl bg-primary p-8 text-primary-foreground">
        <div className="flex items-center gap-2 mb-2 text-secondary text-sm font-semibold uppercase tracking-wider">
          <Coins className="h-4 w-4 animate-coin-bounce" />
          Cash Quest
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
          Master Your Money 💰
        </h1>
        <p className="text-primary-foreground/80 mb-6 max-w-lg">
          Learn financial literacy through quick lessons, earn points, and redeem real rewards. Built by MHS students, for MHS students.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/lessons">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold hotspot">
              <BookOpen className="mr-2 h-4 w-4" /> Start Learning
            </Button>
          </Link>
          <Link to="/progress">
            <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Trophy className="mr-2 h-4 w-4" /> View Progress
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Knowledge Points", value: progress.knowledgePoints, icon: Star, color: "text-secondary" },
          { label: "Redeemable Points", value: progress.redeemablePoints, icon: Coins, color: "text-secondary" },
          { label: "Lessons Done", value: `${progress.completedLessons.length}/${lessons.length}`, icon: BookOpen, color: "text-primary" },
          { label: "Day Streak", value: progress.currentStreak, icon: Flame, color: "text-destructive" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border bg-card p-4 card-hover">
            <Icon className={`h-5 w-5 ${color} mb-2`} />
            <p className="text-2xl font-bold font-heading">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-semibold">Overall Progress</h3>
          <span className="text-sm font-medium text-muted-foreground">{completionPercent}%</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full gold-gradient transition-all duration-500" style={{ width: `${completionPercent}%` }} />
        </div>
      </div>

      {/* Lesson of the Day */}
      <div className="rounded-xl border bg-card p-6 card-hover">
        <div className="flex items-center gap-2 mb-1 text-secondary text-xs font-semibold uppercase tracking-wider">
          <Flame className="h-4 w-4" /> Lesson of the Day
        </div>
        <h2 className="font-heading text-xl font-bold mb-1">{lessonOfTheDay.title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{lessonOfTheDay.description}</p>
        <div className="flex items-center gap-4">
          <Link to={`/lessons/${lessonOfTheDay.id}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hotspot">
              Start Lesson <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground">~{lessonOfTheDay.estimatedMinutes} min • +{lessonOfTheDay.knowledgePoints} KP</span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/lessons" className="rounded-xl border bg-card p-5 card-hover flex items-center gap-4 hotspot">
          <div className="rounded-lg bg-primary/10 p-3"><BookOpen className="h-6 w-6 text-primary" /></div>
          <div>
            <h3 className="font-heading font-semibold">Lesson Library</h3>
            <p className="text-sm text-muted-foreground">{lessons.length} lessons available</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
        </Link>
        <Link to="/rewards" className="rounded-xl border bg-card p-5 card-hover flex items-center gap-4 hotspot">
          <div className="rounded-lg bg-secondary/20 p-3"><Gift className="h-6 w-6 text-secondary" /></div>
          <div>
            <h3 className="font-heading font-semibold">Rewards Store</h3>
            <p className="text-sm text-muted-foreground">Redeem your points for prizes</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
