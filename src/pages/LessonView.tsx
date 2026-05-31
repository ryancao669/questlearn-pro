import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, BookOpen, Play, Pencil, ExternalLink, ShieldAlert, Maximize, Lightbulb } from "lucide-react";
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
  const [phase, setPhase] = useState<"lesson" | "scenarios" | "quiz" | "results">("lesson");
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [currentQuizQ, setCurrentQuizQ] = useState(0);
  const [exerciseAnswer, setExerciseAnswer] = useState<number | null>(null);
  const [exerciseSubmitted, setExerciseSubmitted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioChoice, setScenarioChoice] = useState<number | null>(null);
  const quizContainerRef = useRef<HTMLDivElement>(null);


  const finishQuiz = useCallback((wasAutoSubmitted = false) => {
    if (!lesson) return;
    const correct = lesson.quiz.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correctIndex ? 1 : 0), 0);
    const score = Math.round((correct / lesson.quiz.length) * 100);
    completeLesson(lesson.id, lesson.knowledgePoints, lesson.redeemablePoints, score);
    if (wasAutoSubmitted) setAutoSubmitted(true);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setPhase("results");
  }, [lesson, quizAnswers, completeLesson]);

  const triggerWarning = useCallback((reason: string) => {
    setWarnings(w => {
      const next = w + 1;
      if (next > MAX_WARNINGS) {
        toast({ title: "Quiz auto-submitted", description: `Too many violations: ${reason}`, variant: "destructive" });
        finishQuiz(true);
      } else {
        toast({
          title: `⚠️ Warning ${next} of ${MAX_WARNINGS}`,
          description: `${reason}. ${MAX_WARNINGS - next + 1} more and your quiz will be auto-submitted.`,
          variant: "destructive",
        });
      }
      return next;
    });
  }, [finishQuiz]);

  useEffect(() => {
    if (phase !== "quiz" || !quizStarted) return;
    const onVisibility = () => { if (document.hidden) triggerWarning("You switched tabs or minimized the window"); };
    const onBlur = () => triggerWarning("You left the quiz window");
    const block = (e: Event) => { e.preventDefault(); };
    const onFsChange = () => { if (!document.fullscreenElement) triggerWarning("You exited fullscreen mode"); };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("paste", block);
    document.addEventListener("contextmenu", block);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, [phase, quizStarted, triggerWarning]);

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
    } else if (lesson.scenarios && lesson.scenarios.length > 0) {
      setPhase("scenarios");
    } else {
      setPhase("quiz");
      setQuizAnswers(new Array(lesson.quiz.length).fill(null));
    }
  };

  const handleScenarioNext = () => {
    setScenarioChoice(null);
    if (lesson.scenarios && scenarioIndex < lesson.scenarios.length - 1) {
      setScenarioIndex(scenarioIndex + 1);
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
      finishQuiz();
    }
  };

  const startQuiz = async () => {
    try { await quizContainerRef.current?.requestFullscreen(); } catch { /* ignore */ }
    setQuizStarted(true);
  };

  const quizScore = phase === "results" ? lesson.quiz.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correctIndex ? 1 : 0), 0) : 0;

  if (phase === "results") {
    const nextLesson = lessons.find(l => l.id === lesson.id + 1);
    return (
      <div className="container py-8 animate-slide-up">
        <div className="max-w-lg mx-auto rounded-xl border bg-card p-8 text-center">
          <div className="text-5xl mb-4">{autoSubmitted ? "⚠️" : "🎉"}</div>
          <h2 className="font-heading text-2xl font-bold mb-2">{autoSubmitted ? "Quiz Auto-Submitted" : "Lesson Complete!"}</h2>
          {autoSubmitted && <p className="text-sm text-destructive mb-2">Too many anti-cheat violations during the quiz.</p>}
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

  if (phase === "scenarios" && lesson.scenarios) {
    const scenario = lesson.scenarios[scenarioIndex];
    const selected = scenarioChoice !== null ? scenario.choices[scenarioChoice] : null;
    return (
      <div className="container py-8 pb-24 md:pb-8 animate-slide-up">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">What Would You Do?</p>
              <h1 className="font-heading text-xl font-bold">{scenario.title}</h1>
            </div>
          </div>
          <div className="h-2 rounded-full bg-muted mb-6">
            <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${((scenarioIndex + 1) / lesson.scenarios.length) * 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mb-4">Scenario {scenarioIndex + 1} of {lesson.scenarios.length}</p>

          <div className="rounded-xl border bg-card p-6 mb-4">
            <p className="text-foreground/90 mb-5">{scenario.situation}</p>
            <div className="space-y-2">
              {scenario.choices.map((c, i) => {
                let style = "border-border hover:border-primary/50";
                if (scenarioChoice !== null) {
                  if (i === scenarioChoice) style = c.isBest ? "border-success bg-success/10" : "border-secondary bg-secondary/10";
                  else style = "border-border opacity-60";
                }
                return (
                  <button
                    key={i}
                    onClick={() => { if (scenarioChoice === null) setScenarioChoice(i); }}
                    disabled={scenarioChoice !== null}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${style}`}
                  >
                    {c.label}
                    {scenarioChoice !== null && i === scenarioChoice && c.isBest && <CheckCircle2 className="inline ml-2 h-4 w-4 text-success" />}
                  </button>
                );
              })}
            </div>
            {selected && (
              <div className={`mt-4 rounded-lg p-4 text-sm ${selected.isBest ? "bg-success/10 text-foreground" : "bg-muted text-foreground/90"}`}>
                <p className="font-semibold mb-1">{selected.isBest ? "✓ Best choice" : "Here's what happens:"}</p>
                <p>{selected.outcome}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleScenarioNext} disabled={scenarioChoice === null} className="hotspot">
              {scenarioIndex < lesson.scenarios.length - 1 ? "Next Scenario" : "Take Quiz"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }


  if (phase === "quiz") {
    if (!quizStarted) {
      return (
        <div className="container py-8 animate-slide-up">
          <div className="max-w-lg mx-auto rounded-xl border bg-card p-8">
            <ShieldAlert className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold mb-2 text-center">Secure Quiz Mode</h2>
            <p className="text-muted-foreground text-sm mb-4 text-center">
              To keep things fair, the quiz runs in a locked-down mode.
            </p>
            <ul className="text-sm text-foreground/90 space-y-2 mb-6 bg-muted/50 rounded-lg p-4">
              <li>• The quiz opens in <strong>fullscreen</strong></li>
              <li>• <strong>Switching tabs</strong>, leaving the window, or exiting fullscreen counts as a warning</li>
              <li>• <strong>Copy, paste, and right-click</strong> are disabled</li>
              <li>• You get <strong>{MAX_WARNINGS} warnings</strong> — after that, the quiz auto-submits</li>
            </ul>
            <Button onClick={startQuiz} className="w-full hotspot">
              <Maximize className="mr-2 h-4 w-4" /> Start Secure Quiz
            </Button>
          </div>
        </div>
      );
    }
    const q = lesson.quiz[currentQuizQ];
    return (
      <div ref={quizContainerRef} className="container py-8 animate-slide-up bg-background min-h-screen select-none">
        <div className="max-w-lg mx-auto">
          {warnings > 0 && (
            <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 flex items-center gap-2 text-sm">
              <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
              <span className="text-destructive font-medium">Warning {warnings}/{MAX_WARNINGS} — stay on this tab in fullscreen.</span>
            </div>
          )}
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
