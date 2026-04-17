import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, BookOpen, Play, Pencil, ExternalLink, ShieldAlert, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lessons } from "@/data/lessons";
import { useProgress } from "@/hooks/useProgress";
import { toast } from "@/hooks/use-toast";

const MAX_WARNINGS = 2;

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLessonUnlocked, isLessonCompleted, completeLesson } = useProgress();

  const lesson = lessons.find(l => l.id === Number(id));
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<"lesson" | "quiz" | "results">("lesson");
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [currentQuizQ, setCurrentQuizQ] = useState(0);
  const [exerciseAnswer, setExerciseAnswer] = useState<number | null>(null);
  const [exerciseSubmitted, setExerciseSubmitted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const quizContainerRef = useRef<HTMLDivElement>(null);

  if (!lesson) return <div className="container py-8"><p>Lesson not found.</p><Link to="/lessons" className="text-primary underline">Back to lessons</Link></div>;
  if (!isLessonUnlocked(lesson.id)) return <div className="container py-8"><p>This lesson is locked. Complete the previous lesson first.</p><Link to="/lessons" className="text-primary underline">Back to lessons</Link></div>;
  if (isLessonCompleted(lesson.id) && phase === "lesson") {
    return (
      <div className="container py-8 animate-slide-up">
        <div className="rounded-xl border bg-card p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-2">Already Completed!</h2>
          <p className="text-muted-foreground mb-4">You've already finished this lesson.</p>
          <Link to="/lessons"><Button>Back to Lessons</Button></Link>
        </div>
      </div>
    );
  }

  const step = lesson.steps[stepIndex];
  const totalSteps = lesson.steps.length;

  const handleNextStep = () => {
    setExerciseAnswer(null);
    setExerciseSubmitted(false);
    if (stepIndex < totalSteps - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setPhase("quiz");
      setQuizAnswers(new Array(lesson.quiz.length).fill(null));
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuizQ] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleQuizNext = () => {
    if (currentQuizQ < lesson.quiz.length - 1) {
      setCurrentQuizQ(currentQuizQ + 1);
    } else {
      const correct = lesson.quiz.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correctIndex ? 1 : 0), 0);
      const score = Math.round((correct / lesson.quiz.length) * 100);
      completeLesson(lesson.id, lesson.knowledgePoints, lesson.redeemablePoints, score);
      setPhase("results");
    }
  };

  const quizScore = phase === "results" ? lesson.quiz.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correctIndex ? 1 : 0), 0) : 0;

  if (phase === "results") {
    const nextLesson = lessons.find(l => l.id === lesson.id + 1);
    return (
      <div className="container py-8 animate-slide-up">
        <div className="max-w-lg mx-auto rounded-xl border bg-card p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-heading text-2xl font-bold mb-2">Lesson Complete!</h2>
          <p className="text-muted-foreground mb-4">{lesson.icon} {lesson.title}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-2xl font-bold text-primary">{quizScore}/{lesson.quiz.length}</p>
              <p className="text-xs text-muted-foreground">Quiz Score</p>
            </div>
            <div className="rounded-lg gold-gradient p-3">
              <p className="text-2xl font-bold">+{lesson.knowledgePoints}</p>
              <p className="text-xs">Knowledge Points</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">+{lesson.redeemablePoints} Redeemable Points earned!</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/lessons"><Button variant="outline">All Lessons</Button></Link>
            {nextLesson && (
              <Link to={`/lessons/${nextLesson.id}`}>
                <Button className="hotspot">Next: {nextLesson.title} <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            )}
            <Link to="/rewards"><Button className="gold-gradient text-secondary-foreground font-semibold">View Rewards</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    const q = lesson.quiz[currentQuizQ];
    return (
      <div className="container py-8 animate-slide-up">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-bold">Quiz: {lesson.title}</h2>
            <span className="text-sm text-muted-foreground">{currentQuizQ + 1}/{lesson.quiz.length}</span>
          </div>
          <div className="h-2 rounded-full bg-muted mb-6">
            <div className="h-full rounded-full gold-gradient transition-all" style={{ width: `${((currentQuizQ + 1) / lesson.quiz.length) * 100}%` }} />
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="font-medium mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuizAnswer(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                    quizAnswers[currentQuizQ] === i ? "border-primary bg-primary/10 font-medium" : "border-border hover:border-primary/50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <Button
              onClick={handleQuizNext}
              disabled={quizAnswers[currentQuizQ] === null}
              className="w-full mt-4 hotspot"
            >
              {currentQuizQ < lesson.quiz.length - 1 ? "Next Question" : "Finish Quiz"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 pb-24 md:pb-8 animate-slide-up">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link to="/lessons">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{lesson.icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Lesson {lesson.id} of {lessons.length}</p>
              <h1 className="font-heading text-xl font-bold">{lesson.title}</h1>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 rounded-full bg-muted mb-6">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mb-4">Step {stepIndex + 1} of {totalSteps}</p>

        {/* Step Content */}
        <div className="rounded-xl border bg-card p-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            {step.type === "text" && <BookOpen className="h-4 w-4 text-primary" />}
            {step.type === "video" && <Play className="h-4 w-4 text-primary" />}
            {step.type === "exercise" && <Pencil className="h-4 w-4 text-secondary" />}
            {step.type === "interactive" && <ExternalLink className="h-4 w-4 text-secondary" />}
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {step.type === "interactive" ? "Interactive Tool" : step.type}
            </span>
          </div>
          <h3 className="font-heading text-lg font-semibold mb-3">{step.title}</h3>

          {step.type === "text" && (
            <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-line" dangerouslySetInnerHTML={{
              __html: step.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
            }} />
          )}

          {step.type === "video" && (
            <div>
              <p className="text-sm text-muted-foreground mb-3">{step.content}</p>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe src={step.videoUrl} className="w-full h-full" allowFullScreen title={step.title} />
              </div>
            </div>
          )}

          {step.type === "interactive" && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">{step.content}</p>
              <a href={step.interactiveUrl} target="_blank" rel="noopener noreferrer">
                <Button className="hotspot">
                  <ExternalLink className="mr-2 h-4 w-4" /> Open Salary Calculator
                </Button>
              </a>
              <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-muted border">
                <iframe src={step.interactiveUrl} className="w-full h-full" title={step.title} />
              </div>
            </div>
          )}

          {step.type === "exercise" && (
            <div>
              <p className="font-medium mb-3">{step.exercisePrompt}</p>
              <div className="space-y-2">
                {step.exerciseOptions?.map((opt, i) => {
                  let style = "border-border hover:border-primary/50";
                  if (exerciseSubmitted) {
                    if (i === step.exerciseCorrectIndex) style = "border-success bg-success/10";
                    else if (i === exerciseAnswer) style = "border-destructive bg-destructive/10";
                  } else if (exerciseAnswer === i) {
                    style = "border-primary bg-primary/10";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => { if (!exerciseSubmitted) setExerciseAnswer(i); }}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${style}`}
                    >
                      {opt}
                      {exerciseSubmitted && i === step.exerciseCorrectIndex && <CheckCircle2 className="inline ml-2 h-4 w-4 text-success" />}
                      {exerciseSubmitted && i === exerciseAnswer && i !== step.exerciseCorrectIndex && <XCircle className="inline ml-2 h-4 w-4 text-destructive" />}
                    </button>
                  );
                })}
              </div>
              {!exerciseSubmitted && exerciseAnswer !== null && (
                <Button onClick={() => setExerciseSubmitted(true)} className="mt-3 hotspot">Check Answer</Button>
              )}
              {exerciseSubmitted && (
                <p className={`mt-3 text-sm font-medium ${exerciseAnswer === step.exerciseCorrectIndex ? "text-success" : "text-destructive"}`}>
                  {exerciseAnswer === step.exerciseCorrectIndex ? "✓ Correct!" : "✗ Not quite. The correct answer is highlighted above."}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => { setStepIndex(Math.max(0, stepIndex - 1)); setExerciseAnswer(null); setExerciseSubmitted(false); }} disabled={stepIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={step.type === "exercise" && !exerciseSubmitted}
            className="hotspot"
          >
            {stepIndex < totalSteps - 1 ? "Next" : "Take Quiz"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
