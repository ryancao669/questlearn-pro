import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface UserProgress {
  completedLessons: number[];
  knowledgePoints: number;
  redeemablePoints: number;
  quizScores: Record<number, number>;
  redeemedRewards: number[];
  currentStreak: number;
  lastCompletedDate: string | null;
}

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  knowledgePoints: 0,
  redeemablePoints: 0,
  quizScores: {},
  redeemedRewards: [],
  currentStreak: 0,
  lastCompletedDate: null,
};

export function useProgress() {
  const { user, profile, isCreator, studentView } = useAuth();
  const creatorBypass = isCreator && !studentView;
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    if (!user) {
      setProgress(DEFAULT_PROGRESS);
      setLoaded(true);
      return;
    }
    const [{ data: prog }, { data: comps }, { data: reds }] = await Promise.all([
      supabase
        .from("student_progress")
        .select("knowledge_points,redeemable_points,current_streak,last_completed_date")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase.from("lesson_completions").select("lesson_id,quiz_score").eq("user_id", user.id),
      supabase.from("reward_redemptions").select("reward_id").eq("user_id", user.id),
    ]);
    const quizScores: Record<number, number> = {};
    (comps ?? []).forEach((c) => {
      quizScores[c.lesson_id] = c.quiz_score;
    });
    setProgress({
      completedLessons: (comps ?? []).map((c) => c.lesson_id),
      knowledgePoints: prog?.knowledge_points ?? 0,
      redeemablePoints: prog?.redeemable_points ?? 0,
      quizScores,
      redeemedRewards: (reds ?? []).map((r) => r.reward_id),
      currentStreak: prog?.current_streak ?? 0,
      lastCompletedDate: prog?.last_completed_date ?? null,
    });
    setLoaded(true);
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  const completeLesson = useCallback(
    async (lessonId: number, knowledgePts: number, redeemablePts: number, quizScore: number) => {
      if (!user || !profile?.school_id) return;
      if (progress.completedLessons.includes(lessonId)) return;

      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const isConsecutive = progress.lastCompletedDate === yesterday;
      const newStreak = isConsecutive ? progress.currentStreak + 1 : 1;
      const newKP = progress.knowledgePoints + knowledgePts;
      const newRP = progress.redeemablePoints + redeemablePts;

      // Optimistic update
      setProgress((p) => ({
        ...p,
        completedLessons: [...p.completedLessons, lessonId],
        knowledgePoints: newKP,
        redeemablePoints: newRP,
        quizScores: { ...p.quizScores, [lessonId]: quizScore },
        currentStreak: newStreak,
        lastCompletedDate: today,
      }));

      await supabase.from("lesson_completions").insert({
        user_id: user.id,
        school_id: profile.school_id,
        lesson_id: lessonId,
        quiz_score: quizScore,
      });
      await supabase
        .from("student_progress")
        .update({
          knowledge_points: newKP,
          redeemable_points: newRP,
          current_streak: newStreak,
          last_completed_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    },
    [user, profile, progress]
  );

  const redeemReward = useCallback(
    async (rewardId: number, cost: number) => {
      if (!user || !profile?.school_id) return;
      if (progress.redeemablePoints < cost) return;
      const newRP = progress.redeemablePoints - cost;

      setProgress((p) => ({
        ...p,
        redeemablePoints: newRP,
        redeemedRewards: [...p.redeemedRewards, rewardId],
      }));

      await supabase.from("reward_redemptions").insert({
        user_id: user.id,
        school_id: profile.school_id,
        reward_id: rewardId,
        cost,
      });
      await supabase
        .from("student_progress")
        .update({ redeemable_points: newRP, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
    },
    [user, profile, progress]
  );

  const isLessonUnlocked = useCallback(
    (lessonId: number) => creatorBypass || lessonId === 1 || progress.completedLessons.includes(lessonId - 1),
    [progress.completedLessons, creatorBypass]
  );

  const isLessonCompleted = useCallback(
    (lessonId: number) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  const resetProgress = useCallback(async () => {
    setProgress(DEFAULT_PROGRESS);
    await reload();
  }, [reload]);

  return { progress, loaded, completeLesson, redeemReward, isLessonUnlocked, isLessonCompleted, resetProgress };
}
