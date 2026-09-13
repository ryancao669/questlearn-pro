import { useEffect, useState } from "react";
import { Trophy, Medal, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { lessons } from "@/data/lessons";

interface Row {
  user_id: string;
  display_name: string | null;
  kp: number;
  lessons: number;
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-5 w-5 text-secondary" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-primary" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
}

function nameOf(r: Row) {
  if (r.display_name) {
    const parts = r.display_name.trim().split(/\s+/);
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
  }
  return "Student";
}

export default function Leaderboard() {
  const { user, school } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!school) return;
      // Fetch school-scoped leaderboard via secure function (names + points only)
      const { data } = await (supabase.rpc as any)("get_school_leaderboard");
      if (!active) return;
      const merged: Row[] = (data ?? []).map((r: any) => ({
        user_id: r.user_id,
        display_name: r.display_name ?? null,
        kp: r.knowledge_points,
        lessons: Number(r.lessons_completed ?? 0),
      }));
      setRows(merged);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [school]);

  const totalLessons = lessons.length;
  const myRank = rows.findIndex((r) => r.user_id === user?.id) + 1;
  const podium = [rows[1], rows[0], rows[2]].filter(Boolean);

  return (
    <div className="container py-8 pb-24 md:pb-8 animate-slide-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="h-5 w-5 text-secondary" />
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Competitive</p>
        </div>
        <h1 className="font-heading text-3xl font-bold">{school?.name ?? "School"} Rankings</h1>
        <p className="text-muted-foreground mt-1">
          {myRank > 0 ? `You're ranked #${myRank} of ${rows.length}.` : "See how you rank against classmates."}
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading rankings...</p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          No one has earned points yet. Be the first!
        </div>
      ) : (
        <>
          {podium.length === 3 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {podium.map((student, i) => {
                const podiumOrder = [2, 1, 3];
                const heights = ["h-24", "h-32", "h-20"];
                const bgColors = ["bg-muted", "gold-gradient", "bg-muted"];
                return (
                  <div key={student.user_id} className="flex flex-col items-center">
                    <div className="text-center mb-2">
                      {getRankIcon(podiumOrder[i])}
                      <p className="font-heading font-bold text-sm mt-1">{nameOf(student)}</p>
                      <p className="text-xs text-muted-foreground">{student.kp} KP</p>
                    </div>
                    <div className={`w-full ${heights[i]} rounded-t-lg ${bgColors[i]} flex items-end justify-center pb-2`}>
                      <span className="font-heading font-bold text-lg">#{podiumOrder[i]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_80px_80px] gap-2 px-4 py-3 bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>#</span>
              <span>Student</span>
              <span className="text-right">KP</span>
              <span className="text-right">Lessons</span>
            </div>
            {rows.map((student, idx) => {
              const rank = idx + 1;
              const isMe = student.user_id === user?.id;
              return (
                <div
                  key={student.user_id}
                  className={`grid grid-cols-[40px_1fr_80px_80px] gap-2 px-4 py-3 border-t items-center ${
                    isMe ? "bg-primary/10" : rank <= 3 ? "bg-secondary/5" : ""
                  }`}
                >
                  <div className="flex items-center">{getRankIcon(rank)}</div>
                  <span className="font-medium text-sm">
                    {nameOf(student)} {isMe && <span className="text-xs text-primary">(you)</span>}
                  </span>
                  <span className="text-right text-sm font-semibold">{student.kp}</span>
                  <span className="text-right text-sm text-muted-foreground">{student.lessons}/{totalLessons}</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Rankings update as students complete lessons and earn Knowledge Points.
          </p>
        </>
      )}
    </div>
  );
}
