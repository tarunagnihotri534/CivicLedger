import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { civicLedgerService } from '@/lib/civicLedgerService';
import { AuditBlock } from '@/lib/enhancedICPService';
import { 
  ShieldCheck, 
  Link, 
  CheckCircle2, 
  RefreshCw, 
  Binary, 
  Layers, 
  Hash, 
  Clock, 
  Database,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BlockchainAuditLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlockchainAuditLedgerModal: React.FC<BlockchainAuditLedgerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [blocks, setBlocks] = useState<AuditBlock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [chainValid, setChainValid] = useState<boolean | null>(null);

  const loadLedger = async () => {
    setIsLoading(true);
    try {
      const data = await civicLedgerService.getAuditLedger(50);
      setBlocks(data.blocks);
      setChainValid(data.integrityValid);
    } catch (err) {
      console.error("Failed to load blockchain ledger:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLedger();
    }
  }, [isOpen]);

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    try {
      const result = await civicLedgerService.verifyBlockchainIntegrity();
      setChainValid(result.valid);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[760px] max-h-[85vh] flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200">
                <Database className="w-3 h-3 mr-1" />
                Sovereign ICP Subnet
              </Badge>
              <Badge variant="outline" className="text-xs">
                SHA-256 Merkle Ledger
              </Badge>
            </div>

            {chainValid && (
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                Chain 100% Valid & Tamper-Evident
              </Badge>
            )}
          </div>

          <DialogTitle className="text-xl font-bold flex items-center space-x-2">
            <span>Cryptographic Blockchain Audit Trail</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Immutable chained transaction blocks verified via cryptographic hashes and Merkle root calculation.
          </DialogDescription>
        </DialogHeader>

        {/* Verification banner & Actions */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Ledger Height: {blocks.length} Blocks Mined
              </div>
              <div className="text-xs text-slate-500">
                Every policy, fund transfer, and milestone release is cryptographically linked.
              </div>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md text-xs whitespace-nowrap"
          >
            {isVerifying ? (
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            )}
            Verify All Hashes
          </Button>
        </div>

        {/* Chained Blocks List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">Loading blockchain state...</div>
          ) : blocks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No blocks mined yet.</div>
          ) : (
            blocks.slice().reverse().map((block) => (
              <motion.div
                key={block.index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Block #{block.index}
                    </span>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {block.eventType}
                    </Badge>
                  </div>

                  <span className="text-xs text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(block.timestamp).toLocaleString()}
                  </span>
                </div>

                {/* Hashes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center">
                      <Hash className="w-2.5 h-2.5 mr-1" />
                      Block Hash
                    </div>
                    <div className="truncate text-blue-600 dark:text-blue-400 font-semibold" title={block.hash}>
                      {block.hash}
                    </div>
                  </div>

                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center">
                      <Link className="w-2.5 h-2.5 mr-1" />
                      Previous Hash
                    </div>
                    <div className="truncate text-slate-500" title={block.previousHash}>
                      {block.previousHash}
                    </div>
                  </div>
                </div>

                {/* Payload summary */}
                <div className="p-2.5 rounded bg-slate-50/60 dark:bg-slate-800/30 text-xs text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Payload State:</div>
                  <pre className="font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {typeof block.payload === 'object' ? JSON.stringify(block.payload, null, 2) : String(block.payload)}
                  </pre>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Explorer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
