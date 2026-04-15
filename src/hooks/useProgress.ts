import { useState, useEffect, useCallback } from "react";

export interface UserProgress {
  completedLessons: number[];
  knowledgePoints: number;
  redeemablePoints: number;
  quizScores: Record<number, number>; // lessonId -> score percentage
  redeemedRewards: number[]; // reward ids
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

const STORAGE_KEY = "cashquest-progress";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeLesson = useCallback((lessonId: number, knowledgePts: number, redeemablePts: number, quizScore: number) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const today = new Date().toDateString();
      const isConsecutive = prev.lastCompletedDate === new Date(Date.now() - 86400000).toDateString();
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        knowledgePoints: prev.knowledgePoints + knowledgePts,
        redeemablePoints: prev.redeemablePoints + redeemablePts,
        quizScores: { ...prev.quizScores, [lessonId]: quizScore },
        currentStreak: isConsecutive ? prev.currentStreak + 1 : 1,
        lastCompletedDate: today,
      };
    });
  }, []);

  const redeemReward = useCallback((rewardId: number, cost: number) => {
    setProgress(prev => {
      if (prev.redeemablePoints < cost) return prev;
      return {
        ...prev,
        redeemablePoints: prev.redeemablePoints - cost,
        redeemedRewards: [...prev.redeemedRewards, rewardId],
      };
    });
  }, []);

  const isLessonUnlocked = useCallback((lessonId: number) => {
    if (lessonId === 1) return true;
    return progress.completedLessons.includes(lessonId - 1);
  }, [progress.completedLessons]);

  const isLessonCompleted = useCallback((lessonId: number) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return { progress, completeLesson, redeemReward, isLessonUnlocked, isLessonCompleted, resetProgress };
}
