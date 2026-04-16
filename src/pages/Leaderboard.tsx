import { Trophy, Medal, Crown } from "lucide-react";

// Mock leaderboard data for prototype
const mockLeaderboard = [
  { rank: 1, name: "Alex M.", kp: 660, lessons: 8 },
  { rank: 2, name: "Jordan T.", kp: 540, lessons: 6 },
  { rank: 3, name: "Sophia R.", kp: 430, lessons: 5 },
  { rank: 4, name: "Chris B.", kp: 320, lessons: 4 },
  { rank: 5, name: "Maya L.", kp: 210, lessons: 3 },
  { rank: 6, name: "Ethan K.", kp: 200, lessons: 2 },
  { rank: 7, name: "Olivia D.", kp: 100, lessons: 1 },
  { rank: 8, name: "Liam W.", kp: 100, lessons: 1 },
];

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-5 w-5 text-secondary" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-primary" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
}

export default function Leaderboard() {
  return (
    <div className="container py-8 pb-24 md:pb-8 animate-slide-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="h-5 w-5 text-secondary" />
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Competitive</p>
        </div>
        <h1 className="font-heading text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">See how you rank against other MHS students.</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]].map((student, i) => {
          const podiumOrder = [2, 1, 3];
          const heights = ["h-24", "h-32", "h-20"];
          const bgColors = ["bg-muted", "gold-gradient", "bg-muted"];
          return (
            <div key={student.rank} className="flex flex-col items-center">
              <div className="text-center mb-2">
                {getRankIcon(podiumOrder[i])}
                <p className="font-heading font-bold text-sm mt-1">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.kp} KP</p>
              </div>
              <div className={`w-full ${heights[i]} rounded-t-lg ${bgColors[i]} flex items-end justify-center pb-2`}>
                <span className="font-heading font-bold text-lg">#{podiumOrder[i]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Rankings */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_80px_80px] gap-2 px-4 py-3 bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>#</span>
          <span>Student</span>
          <span className="text-right">KP</span>
          <span className="text-right">Lessons</span>
        </div>
        {mockLeaderboard.map(student => (
          <div key={student.rank} className={`grid grid-cols-[40px_1fr_80px_80px] gap-2 px-4 py-3 border-t items-center ${student.rank <= 3 ? "bg-secondary/5" : ""}`}>
            <div className="flex items-center">{getRankIcon(student.rank)}</div>
            <span className="font-medium text-sm">{student.name}</span>
            <span className="text-right text-sm font-semibold">{student.kp}</span>
            <span className="text-right text-sm text-muted-foreground">{student.lessons}/8</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Rankings update as students complete lessons and earn Knowledge Points.
      </p>
    </div>
  );
}
