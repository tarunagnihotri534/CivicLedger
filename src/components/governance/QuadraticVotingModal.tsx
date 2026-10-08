import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { civicLedgerService } from '@/lib/civicLedgerService';
import { 
  Vote, 
  Coins, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuadraticVotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  proposalTitle: string;
  onVoteCast?: (votes: number, credits: number, direction: 'Yes' | 'No') => void;
}

export const QuadraticVotingModal: React.FC<QuadraticVotingModalProps> = ({
  isOpen,
  onClose,
  proposalId,
  proposalTitle,
  onVoteCast
}) => {
  const { toast } = useToast();
  const [direction, setDirection] = useState<'Yes' | 'No'>('Yes');
  const [votesCount, setVotesCount] = useState<number>(3);
  const [voterCredits, setVoterCredits] = useState<number>(100);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Quadratic cost formula: Credits = Votes^2
  const creditCost = votesCount * votesCount;
  const canAfford = voterCredits >= creditCost;

  const handleCastVote = async () => {
    if (!canAfford) {
      toast({
        title: "Insufficient Voice Credits",
        description: `This quadratic vote requires ${creditCost} credits, but you only hold ${voterCredits} credits.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await civicLedgerService.castQuadraticVote(
        proposalId,
        'current-user',
        direction,
        votesCount
      );

      if (result.success) {
        setVoterCredits(result.remainingCredits);
        toast({
          title: "Quadratic Vote Recorded!",
          description: `Allocated ${votesCount} ${direction} vote(s) at cost of ${creditCost} voice credits on the blockchain.`,
        });
        if (onVoteCast) onVoteCast(votesCount, creditCost, direction);
        onClose();
      } else {
        toast({
          title: "Voting Failed",
          description: result.error || "Could not cast vote.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Vote Error",
        description: err.message || "Network issue connecting to voting contract.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-1">
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200">
              <Sparkles className="w-3 h-3 mr-1" />
              Quadratic Voting Engine
            </Badge>
            <Badge variant="outline" className="text-xs">
              Anti-Whale Protocol
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold leading-tight">
            Cast Quadratic Vote
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {proposalTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Voice Credits Status */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Available Voice Credits</div>
                <div className="text-2xl font-black text-purple-700 dark:text-purple-300">
                  {voterCredits} <span className="text-xs font-normal text-slate-500">VC</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Cost of Action</div>
              <div className={`text-xl font-bold ${canAfford ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600'}`}>
                {creditCost} <span className="text-xs font-normal text-slate-500">VC ({votesCount}²)</span>
              </div>
            </div>
          </div>

          {/* Direction Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Choose Vote Stance</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDirection('Yes')}
                className={`flex items-center justify-center space-x-2 p-3.5 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                  direction === 'Yes'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                }`}
              >
                <CheckCircle className={`w-5 h-5 ${direction === 'Yes' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Support Proposal</span>
              </button>

              <button
                type="button"
                onClick={() => setDirection('No')}
                className={`flex items-center justify-center space-x-2 p-3.5 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                  direction === 'No'
                    ? 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                }`}
              >
                <XCircle className={`w-5 h-5 ${direction === 'No' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>Oppose Proposal</span>
              </button>
            </div>
          </div>

          {/* Vote Intensity Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Vote Weight (Intensity)
              </label>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                {votesCount} {votesCount === 1 ? 'Vote' : 'Votes'}
              </span>
            </div>

            <Slider
              value={[votesCount]}
              min={1}
              max={8}
              step={1}
              onValueChange={(val) => setVotesCount(val[0])}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>1 vote (1 credit)</span>
              <span>4 votes (16 credits)</span>
              <span>8 votes (64 credits)</span>
            </div>
          </div>

          {/* Quadratic Explanation Card */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">How Quadratic Voting Works: </span>
              In standard 1-token-1-vote systems, wealthy whales dominate decisions. Under Quadratic Voting, casting <i>N</i> votes costs <i>N²</i> voice credits. Expressing strong conviction is possible, but increasingly costly, producing fair collective consensus.
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleCastVote}
            disabled={!canAfford || isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-600/25"
          >
            {isSubmitting ? "Broadcasting to Ledger..." : `Cast ${votesCount} Vote(s) (-${creditCost} VC)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
