import { Gift, Coins, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rewards } from "@/data/lessons";
import { useProgress } from "@/hooks/useProgress";
import { toast } from "@/hooks/use-toast";

export default function Rewards() {
  const { progress, redeemReward } = useProgress();

  const handleRedeem = (rewardId: number, cost: number, name: string) => {
    if (progress.redeemablePoints < cost) {
      toast({ title: "Not enough points!", description: `You need ${cost - progress.redeemablePoints} more RP.`, variant: "destructive" });
      return;
    }
    redeemReward(rewardId, cost);
    toast({ title: "🎉 Reward Redeemed!", description: `You got: ${name}` });
  };

  return (
    <div className="container py-8 pb-24 md:pb-8 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold">Rewards Store</h1>
          <p className="text-muted-foreground">Spend your Redeemable Points on real prizes!</p>
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full gold-gradient text-secondary-foreground font-semibold">
          <Coins className="h-5 w-5" />
          {progress.redeemablePoints} RP
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map(reward => {
          const redeemed = progress.redeemedRewards.includes(reward.id);
          const canAfford = progress.redeemablePoints >= reward.cost;
          return (
            <div key={reward.id} className={`rounded-xl border bg-card p-5 card-hover ${redeemed ? "opacity-60" : ""}`}>
              <div className="text-4xl mb-3">{reward.emoji}</div>
              <h3 className="font-heading font-semibold">{reward.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold text-secondary text-sm">
                  <Coins className="h-4 w-4" /> {reward.cost} RP
                </span>
                {redeemed ? (
                  <span className="flex items-center gap-1 text-success text-sm font-medium"><CheckCircle2 className="h-4 w-4" /> Redeemed</span>
                ) : (
                  <Button
                    size="sm"
                    disabled={!canAfford}
                    onClick={() => handleRedeem(reward.id, reward.cost, reward.name)}
                    className={canAfford ? "gold-gradient text-secondary-foreground font-semibold hotspot" : ""}
                  >
                    Redeem
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
