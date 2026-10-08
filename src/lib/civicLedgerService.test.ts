import { describe, it, expect, beforeEach } from 'vitest';
import { civicLedgerService } from './civicLedgerService';

describe('CivicLedger Frontend Service Suite', () => {
  describe('Policy & Milestone Execution Management', () => {
    it('fetches all policies with initialized milestones', async () => {
      const policies = await civicLedgerService.getAllPolicies();
      expect(Array.isArray(policies)).toBe(true);
      expect(policies.length).toBeGreaterThanOrEqual(3);

      const pmay = policies.find(p => p.id === 'POL-001');
      expect(pmay).toBeDefined();
      expect(pmay?.milestones).toBeDefined();
      expect(pmay?.milestones?.length).toBe(3);
    });

    it('retrieves individual policy by ID', async () => {
      const policy = await civicLedgerService.getPolicy('POL-001');
      expect(policy).not.toBeNull();
      expect(policy?.title).toContain('PM Awas Yojana');
    });

    it('contractor can submit milestone proof-of-work', async () => {
      const result = await civicLedgerService.submitMilestoneProof('POL-001', 'm1-02', {
        proof_description: 'Drone photogrammetry and stress test certified',
        proof_hash: '0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff'
      });

      expect(result.success).toBe(true);
      const policy = await civicLedgerService.getPolicy('POL-001');
      const milestone = policy?.milestones?.find(m => m.id === 'm1-02');
      expect(milestone?.status).toBe('ProofSubmitted');
      expect(milestone?.proof_hash).toBe('0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff');
    });

    it('auditor can verify milestone and automatically release escrow funds', async () => {
      const policyBefore = await civicLedgerService.getPolicy('POL-001');
      const initialReleased = policyBefore?.fund_released || 0n;

      const result = await civicLedgerService.verifyMilestone(
        'POL-001',
        'm1-02',
        'Auditor-Chief-01',
        'Field inspection validated'
      );

      expect(result.success).toBe(true);
      expect(result.transactionId).toBeDefined();

      const policyAfter = await civicLedgerService.getPolicy('POL-001');
      const milestone = policyAfter?.milestones?.find(m => m.id === 'm1-02');
      expect(milestone?.status).toBe('Verified');
      expect(milestone?.disbursed).toBe(true);
      expect(policyAfter?.fund_released).toBeGreaterThan(initialReleased);
    });
  });

  describe('Quadratic Voting Mathematical Engine', () => {
    it('correctly computes quadratic voice credit cost: Cost = Votes²', async () => {
      const initialBalance = await civicLedgerService.getVoiceCreditBalance('current-user');
      expect(initialBalance).toBe(100);

      // 4 votes cost 4^2 = 16 credits
      const voteRes = await civicLedgerService.castQuadraticVote(
        'PROP-001',
        'current-user',
        'Yes',
        4
      );

      expect(voteRes.success).toBe(true);
      expect(voteRes.remainingCredits).toBe(100 - 16);

      const balanceAfter = await civicLedgerService.getVoiceCreditBalance('current-user');
      expect(balanceAfter).toBe(84);
    });

    it('rejects quadratic vote when requested cost exceeds available voice credits', async () => {
      // 11 votes costs 11^2 = 121 credits (exceeds balance of 84)
      const voteRes = await civicLedgerService.castQuadraticVote(
        'PROP-001',
        'current-user',
        'Yes',
        11
      );

      expect(voteRes.success).toBe(false);
      expect(voteRes.error).toContain('Insufficient Voice Credits');
    });
  });

  describe('AI Algorithmic Policy Risk Assessment', () => {
    it('assesses multi-factor policy risk and generates AI mitigations', async () => {
      const assessment = await civicLedgerService.assessPolicyRisk('POL-001');
      expect(assessment).toBeDefined();
      expect(assessment.policyId).toBe('POL-001');
      expect(assessment.riskScore).toBeGreaterThanOrEqual(0);
      expect(assessment.riskScore).toBeLessThanOrEqual(100);
      expect(['Low', 'Moderate', 'Elevated', 'Critical']).toContain(assessment.riskLevel);
      expect(Array.isArray(assessment.recommendations)).toBe(true);
      expect(assessment.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Cryptographic Blockchain Audit Ledger', () => {
    it('retrieves chained audit blocks with previous hash linkage', async () => {
      const ledgerData = await civicLedgerService.getAuditLedger(10);
      expect(ledgerData.integrityValid).toBe(true);
      expect(ledgerData.blocks.length).toBeGreaterThanOrEqual(1);

      const genesis = ledgerData.blocks[0];
      expect(genesis.index).toBe(0);
      expect(genesis.eventType).toBe('GENESIS_BLOCK');
      expect(genesis.previousHash).toBe('0'.repeat(64));
    });

    it('verifies blockchain cryptographic chain integrity', async () => {
      const verification = await civicLedgerService.verifyBlockchainIntegrity();
      expect(verification.valid).toBe(true);
      expect(verification.blocksVerified).toBeGreaterThan(0);
    });
  });
});
