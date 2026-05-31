import { Link } from "react-router-dom";
import { Lock, CheckCircle2, ArrowRight, Clock, Star, Eye, EyeOff } from "lucide-react";
import { lessons } from "@/data/lessons";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";

export default function Lessons() {
  const { isLessonUnlocked, isLessonCompleted, progress } = useProgress();
  const { isCreator, studentView, toggleStudentView } = useAuth();

  return (
    <div className="container py-8 pb-24 md:pb-8 animate-slide-up">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1">Cash Quest</p>
          <h1 className="font-heading text-3xl font-bold">Lesson Library</h1>
          <p className="text-muted-foreground mt-1">Complete lessons in order to unlock the next one. {progress.completedLessons.length}/{lessons.length} completed.</p>
        </div>
        {isCreator && (
          <button
            onClick={toggleStudentView}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            {studentView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {studentView ? "Exit Student View" : "Student View"}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {lessons.map((lesson) => {
          const unlocked = isLessonUnlocked(lesson.id);
          const completed = isLessonCompleted(lesson.id);
          const score = progress.quizScores[lesson.id];

          return (
            <div key={lesson.id} className={`rounded-xl border p-5 transition-all ${
              completed ? "bg-success/5 border-success/30" : unlocked ? "bg-card card-hover" : "bg-muted/50 opacity-60"
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl mt-0.5">{lesson.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lesson {lesson.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{lesson.category}</span>
                    </div>
                    <h2 className="font-heading text-lg font-bold">{lesson.title}</h2>
                    <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{lesson.estimatedMinutes} min</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" /> +{lesson.knowledgePoints} KP</span>
                      <span className="text-muted-foreground/60">{lesson.steps.length} steps + quiz</span>
                    </div>
                    {completed && score !== undefined && (
                      <p className="text-xs text-success font-medium mt-1">✓ Quiz score: {score}%</p>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {completed ? (
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  ) : unlocked ? (
                    <Link to={`/lessons/${lesson.id}`}>
                      <div className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors hotspot cursor-pointer">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </Link>
                  ) : (
                    <Lock className="h-8 w-8 text-muted-foreground/50" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
