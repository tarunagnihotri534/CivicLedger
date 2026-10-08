import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { civicLedgerService } from '@/lib/civicLedgerService';
import { PolicyRiskAssessment } from '@/lib/enhancedICPService';
import { 
  ShieldAlert, 
  BrainCircuit, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Sparkles,
  TrendingDown,
  Info
} from 'lucide-react';

interface PolicyRiskAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyId: string;
  policyTitle: string;
}

export const PolicyRiskAssessmentModal: React.FC<PolicyRiskAssessmentModalProps> = ({
  isOpen,
  onClose,
  policyId,
  policyTitle
}) => {
  const [assessment, setAssessment] = useState<PolicyRiskAssessment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && policyId) {
      setIsLoading(true);
      civicLedgerService.assessPolicyRisk(policyId)
        .then(res => setAssessment(res))
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, policyId]);

  const getRiskBadgeColor = (level?: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'Elevated': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Moderate': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-1">
            <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200">
              <BrainCircuit className="w-3 h-3 mr-1" />
              AI Algorithmic Audit
            </Badge>
            {assessment && (
              <Badge className={getRiskBadgeColor(assessment.riskLevel)}>
                {assessment.riskLevel} Risk
              </Badge>
            )}
          </div>

          <DialogTitle className="text-xl font-bold">
            Policy Risk & Impact Assessment
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {policyTitle}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400">Computing AI risk parameters...</div>
        ) : assessment ? (
          <div className="space-y-5 py-2">
            {/* Score Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase font-semibold text-slate-500">Composite Risk Score</div>
                <div className="text-3xl font-black text-slate-900 dark:text-slate-100 flex items-baseline space-x-1">
                  <span>{assessment.riskScore}</span>
                  <span className="text-sm font-normal text-slate-500">/ 100</span>
                </div>
              </div>

              <div className="w-48 text-right space-y-1">
                <div className="text-xs text-slate-500 font-medium">Risk Exposure Index</div>
                <Progress value={assessment.riskScore} className="h-2.5" />
              </div>
            </div>

            {/* Factor breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
                <span className="text-slate-400 block mb-0.5">Fund Utilization Pacing</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {assessment.factors.utilizationRatePercent}% Released
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
                <span className="text-slate-400 block mb-0.5">Citizen Grievances</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {assessment.factors.complaintsCount} reported ({assessment.factors.criticalComplaintsCount} critical)
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
                <span className="text-slate-400 block mb-0.5">Milestone Verification SLA</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {assessment.factors.milestonesCompletionRate} Completed
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
                <span className="text-slate-400 block mb-0.5">Contractor Trust Score</span>
                <span className="text-sm font-bold text-emerald-600">
                  {assessment.factors.contractorReputationScore} / 100
                </span>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                Automated AI Mitigations & Actions
              </div>
              <div className="space-y-1.5">
                {assessment.recommendations.map((rec, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 text-xs text-cyan-900 dark:text-cyan-200 flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-cyan-600 shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {assessment.automatedEscrowHoldRecommended && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-300 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  High-risk trigger detected: Automated smart contract escrow freeze advised until next milestone audit pass.
                </span>
              </div>
            )}
          </div>
        ) : null}

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Assessment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
