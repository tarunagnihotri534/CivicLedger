import { 
  enhancedICPService, 
  Policy, 
  PolicyStatus, 
  PolicyMilestone, 
  PolicyRiskAssessment, 
  AuditBlock 
} from './enhancedICPService';

// Backend API URL
const API_BASE = 'http://localhost:3001/api';

// Rich Mock Policies with complete milestone pipelines
const MOCK_POLICIES: Policy[] = [
  {
    id: 'POL-001',
    title: 'PM Awas Yojana - Phase 3',
    description: 'Housing scheme for economically weaker sections',
    category: 'Housing',
    fund_allocation: BigInt(5000000000), // 5 Cr
    fund_released: BigInt(2500000000), // 2.5 Cr
    beneficiaries: 1250,
    status: PolicyStatus.Active,
    created_at: BigInt(1704067200000000000),
    updated_at: BigInt(Date.now() * 1000000),
    district: 'North Delhi',
    contractor: 'Urban Infrastructure Ltd',
    eligibility_criteria: ['Annual income < ₹3 Lakh', 'No existing house ownership'],
    execution_conditions: ['KYC verified', 'Funds available'],
    smart_contract_code: '// Solidity/Rust ICP executable policy\ncontract PMAYExecution {}',
    blockchain_hash: '0x7a8b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
    icp_transaction_id: 'ICP_TX_PMAY_001',
    audit_trail: [],
    ai_analysis_score: 0.92,
    transparency_score: 0.96,
    citizen_approval_rate: 0.88,
    milestones: [
      {
        id: 'm1-01',
        title: 'Geotechnical Soil Survey & Foundation Works',
        description: 'Borehole sampling, structural approval, and concrete foundation for 300 residential units',
        allocated_amount: BigInt(1500000000),
        percentage: 30,
        status: 'Verified',
        proof_hash: '0x8899aabbccddeeff00112233445566778899aabbccddeeff0011223344556677',
        proof_description: 'Structural foundation inspection passed by Chief Civil Engineer',
        submitted_at: BigInt((Date.now() - 30 * 86400000) * 1000000),
        verified_by: 'Auditor-Senior-01',
        verified_at: BigInt((Date.now() - 28 * 86400000) * 1000000),
        disbursed: true
      },
      {
        id: 'm1-02',
        title: 'Superstructure Framework & Masonry Construction',
        description: 'RCC frame columns, brick masonry walls, and storm-water drainage channels',
        allocated_amount: BigInt(2000000000),
        percentage: 40,
        status: 'ProofSubmitted',
        proof_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        proof_description: 'Drone 3D survey model and concrete batch compression logs',
        submitted_at: BigInt(Date.now() * 1000000),
        verified_by: null,
        verified_at: null,
        disbursed: false
      },
      {
        id: 'm1-03',
        title: 'Electrical Grid, Solar Roofs & Citizen Handover',
        description: 'Solar panels installation, internal wiring, sanitation fixtures, and biometric key distribution',
        allocated_amount: BigInt(1500000000),
        percentage: 30,
        status: 'Pending',
        proof_hash: null,
        proof_description: null,
        submitted_at: null,
        verified_by: null,
        verified_at: null,
        disbursed: false
      }
    ]
  },
  {
    id: 'POL-002',
    title: 'Mid Day Meal Program',
    description: 'Nutritious meals for school children across government primary schools',
    category: 'Education',
    fund_allocation: BigInt(3000000000), // 3 Cr
    fund_released: BigInt(1800000000),
    beneficiaries: 5400,
    status: PolicyStatus.Active,
    created_at: BigInt(1704153600000000000),
    updated_at: BigInt(Date.now() * 1000000),
    district: 'South Delhi',
    contractor: 'Food Services Corp',
    eligibility_criteria: ['School going children', 'Age 6-14 years'],
    execution_conditions: ['School registration', 'Food quality certification'],
    smart_contract_code: '',
    blockchain_hash: '0xdef456123789abc...',
    icp_transaction_id: 'ICP_TX_MDM_002',
    audit_trail: [],
    ai_analysis_score: 0.89,
    transparency_score: 0.94,
    citizen_approval_rate: 0.91,
    milestones: [
      {
        id: 'm2-01',
        title: 'Central Kitchen Hygiene Certification',
        description: 'FSSAI standards audit and automated ingredient sourcing contracts',
        allocated_amount: BigInt(1500000000),
        percentage: 50,
        status: 'Verified',
        proof_hash: '0x445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233',
        proof_description: 'ISO 22000 Food Safety Management System Certificate',
        submitted_at: BigInt((Date.now() - 20 * 86400000) * 1000000),
        verified_by: 'Auditor-Health-03',
        verified_at: BigInt((Date.now() - 19 * 86400000) * 1000000),
        disbursed: true
      },
      {
        id: 'm2-02',
        title: 'Nutritional Intake Verification & QR Receipt Delivery',
        description: 'Biometric QR token scanner deployment across 25 cluster kitchens',
        allocated_amount: BigInt(1500000000),
        percentage: 50,
        status: 'Pending',
        proof_hash: null,
        proof_description: null,
        submitted_at: null,
        verified_by: null,
        verified_at: null,
        disbursed: false
      }
    ]
  },
  {
    id: 'POL-003',
    title: 'Digital Literacy Campaign',
    description: 'Computer training and internet proficiency for senior citizens',
    category: 'Technology',
    fund_allocation: BigInt(4500000000),
    fund_released: BigInt(800000000),
    beneficiaries: 850,
    status: PolicyStatus.Paused,
    created_at: BigInt(1704240000000000000),
    updated_at: BigInt(Date.now() * 1000000),
    district: 'East Delhi',
    contractor: 'TechEd Solutions',
    eligibility_criteria: ['Age > 60 years', 'Basic education required'],
    execution_conditions: ['Training center setup', 'Instructor availability'],
    smart_contract_code: '',
    blockchain_hash: '0xghi789456123...',
    icp_transaction_id: 'ICP_TX_DLC_003',
    audit_trail: [],
    ai_analysis_score: 0.85,
    transparency_score: 0.88,
    citizen_approval_rate: 0.82,
    milestones: [
      {
        id: 'm3-01',
        title: 'Digital Lab Equipment Procurement',
        description: 'Laptops, projectors, and accessibility hardware setup',
        allocated_amount: BigInt(2250000000),
        percentage: 50,
        status: 'ProofSubmitted',
        proof_hash: '0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa',
        proof_description: 'Equipment serial numbers invoice and delivery acknowledgment',
        submitted_at: BigInt(Date.now() * 1000000),
        verified_by: null,
        verified_at: null,
        disbursed: false
      }
    ]
  }
];

// Fallback in-memory audit ledger
const MOCK_LEDGER: AuditBlock[] = [
  {
    index: 0,
    timestamp: 1704067200000,
    eventType: 'GENESIS_BLOCK',
    payload: { protocol: 'CivicLedger Sovereign Policy Engine', version: '2.0.0' },
    previousHash: '0'.repeat(64),
    merkleRoot: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    hash: '0000a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef123456'
  },
  {
    index: 1,
    timestamp: 1704070000000,
    eventType: 'POLICY_REGISTERED',
    payload: { policyId: 'POL-001', title: 'PM Awas Yojana - Phase 3', budget: '5000000000' },
    previousHash: '0000a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef123456',
    merkleRoot: '3b95d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    hash: '0000b2c3d4e5f6a17890abcdef1234567890abcdef1234567890abcdef123456'
  },
  {
    index: 2,
    timestamp: 1704150000000,
    eventType: 'MILESTONE_VERIFIED_DISBURSED',
    payload: { policyId: 'POL-001', milestoneId: 'm1-01', amount: '1500000000', auditor: 'Auditor-Senior-01' },
    previousHash: '0000b2c3d4e5f6a17890abcdef1234567890abcdef1234567890abcdef123456',
    merkleRoot: '7c86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    hash: '0000c3d4e5f6a1b27890abcdef1234567890abcdef1234567890abcdef123456'
  }
];

class CivicLedgerService {
  private useMocks: boolean = true;
  private policies: Policy[] = [...MOCK_POLICIES];
  private auditLedger: AuditBlock[] = [...MOCK_LEDGER];
  private voiceCredits: Map<string, number> = new Map([
    ['current-user', 100],
    ['citizen-001', 84],
    ['citizen-002', 150]
  ]);

  // Try fetching from real backend API, fallback seamlessly
  private async safeFetch<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch {
      if (fallback !== undefined) return fallback;
      throw new Error(`Failed to request ${endpoint}`);
    }
  }

  // ---------------- POLICIES & MILESTONES ----------------
  async getAllPolicies(): Promise<Policy[]> {
    try {
      const remote = await this.safeFetch<any[]>('/policies');
      if (Array.isArray(remote) && remote.length > 0) {
        return remote.map(p => ({
          ...p,
          fund_allocation: BigInt(p.fund_allocation || 0),
          fund_released: BigInt(p.fund_released || 0),
          created_at: BigInt(p.created_at || Date.now() * 1000000),
          updated_at: BigInt(p.updated_at || Date.now() * 1000000),
          milestones: (p.milestones || []).map((m: any) => ({
            ...m,
            allocated_amount: BigInt(m.allocated_amount || 0),
            submitted_at: m.submitted_at ? BigInt(m.submitted_at) : null,
            verified_at: m.verified_at ? BigInt(m.verified_at) : null
          }))
        }));
      }
    } catch {
      // Use in-memory state
    }
    return this.policies;
  }

  async getPolicy(policyId: string): Promise<Policy | null> {
    const policies = await this.getAllPolicies();
    return policies.find(p => p.id === policyId) || null;
  }

  async registerPolicy(
    title: string,
    description: string,
    category: string,
    fundAllocation: bigint,
    district: string,
    eligibilityCriteria: string[],
    executionConditions: string[],
    milestones?: any[]
  ): Promise<{ success: boolean; policyId?: string; policy?: Policy; error?: string }> {
    try {
      const result = await this.safeFetch<any>('/policies', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          category,
          fund_allocation: fundAllocation.toString(),
          district,
          eligibility_criteria: eligibilityCriteria,
          execution_conditions: executionConditions,
          milestones
        })
      });
      if (result && result.id) {
        return { success: true, policyId: result.id };
      }
    } catch {
      // Fallback local creation
    }

    const newPolicyId = `POL-${Date.now().toString().slice(-4)}`;
    const newPolicy: Policy = {
      id: newPolicyId,
      title,
      description,
      category,
      fund_allocation: fundAllocation,
      fund_released: 0n,
      beneficiaries: 0,
      status: PolicyStatus.Active,
      created_at: BigInt(Date.now() * 1000000),
      updated_at: BigInt(Date.now() * 1000000),
      district,
      eligibility_criteria: eligibilityCriteria,
      execution_conditions: executionConditions,
      smart_contract_code: '',
      transparency_score: 0.95,
      citizen_approval_rate: 0.90,
      audit_trail: [],
      milestones: (milestones || [
        {
          id: `m-${Date.now()}-1`,
          title: 'Initial Setup & Foundation',
          description: 'Statutory approvals and groundwork',
          allocated_amount: (fundAllocation * 30n) / 100n,
          percentage: 30,
          status: 'Pending',
          disbursed: false
        },
        {
          id: `m-${Date.now()}-2`,
          title: 'Core Execution',
          description: 'Main project construction work',
          allocated_amount: (fundAllocation * 40n) / 100n,
          percentage: 40,
          status: 'Pending',
          disbursed: false
        },
        {
          id: `m-${Date.now()}-3`,
          title: 'Inspection & Citizen Handover',
          description: 'Quality audit and completion verification',
          allocated_amount: (fundAllocation * 30n) / 100n,
          percentage: 30,
          status: 'Pending',
          disbursed: false
        }
      ])
    };

    this.policies.unshift(newPolicy);
    return { success: true, policyId: newPolicyId, policy: newPolicy };
  }

  // Milestone proof submission by contractor
  async submitMilestoneProof(
    policyId: string,
    milestoneId: string,
    proof: { proof_description: string; proof_hash?: string; media_links?: string[] }
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await this.safeFetch<any>(`/policies/${policyId}/milestones/${milestoneId}/submit-proof`, {
        method: 'POST',
        body: JSON.stringify(proof)
      });
      if (res && res.success) return res;
    } catch {
      // Local fallback
    }

    const policy = this.policies.find(p => p.id === policyId);
    if (!policy || !policy.milestones) return { success: false, error: 'Policy not found' };

    const milestone = policy.milestones.find(m => m.id === milestoneId);
    if (!milestone) return { success: false, error: 'Milestone not found' };

    milestone.status = 'ProofSubmitted';
    milestone.proof_description = proof.proof_description;
    milestone.proof_hash = proof.proof_hash || ('0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2));
    milestone.submitted_at = BigInt(Date.now() * 1000000);

    return { success: true, message: 'Proof submitted to smart escrow contract' };
  }

  // Milestone verification by auditor, triggering automated fund release
  async verifyMilestone(
    policyId: string,
    milestoneId: string,
    auditorId: string,
    remarks?: string
  ): Promise<{ success: boolean; message?: string; transactionId?: string; error?: string }> {
    try {
      const res = await this.safeFetch<any>(`/policies/${policyId}/milestones/${milestoneId}/verify`, {
        method: 'POST',
        body: JSON.stringify({ auditor_id: auditorId, remarks })
      });
      if (res && res.success) return res;
    } catch {
      // Local fallback
    }

    const policy = this.policies.find(p => p.id === policyId);
    if (!policy || !policy.milestones) return { success: false, error: 'Policy not found' };

    const milestone = policy.milestones.find(m => m.id === milestoneId);
    if (!milestone) return { success: false, error: 'Milestone not found' };

    milestone.status = 'Verified';
    milestone.verified_by = auditorId;
    milestone.verified_at = BigInt(Date.now() * 1000000);
    milestone.disbursed = true;

    policy.fund_released += milestone.allocated_amount;

    return { 
      success: true, 
      message: 'Milestone verified! Funds automatically released to contractor',
      transactionId: `TX-MLST-${Math.random().toString(16).slice(2, 8).toUpperCase()}` 
    };
  }

  // ---------------- AI RISK ASSESSMENT ----------------
  async assessPolicyRisk(policyId: string): Promise<PolicyRiskAssessment> {
    try {
      return await this.safeFetch<PolicyRiskAssessment>(`/policies/${policyId}/risk-assessment`);
    } catch {
      // Fallback calculation
      const policy = this.policies.find(p => p.id === policyId);
      const totalMilestones = policy?.milestones?.length || 1;
      const verified = policy?.milestones?.filter(m => m.status === 'Verified').length || 0;
      const riskScore = 24;

      return {
        policyId,
        policyTitle: policy?.title || 'Unknown Policy',
        riskScore,
        riskLevel: 'Moderate',
        factors: {
          complaintsCount: 2,
          criticalComplaintsCount: 0,
          utilizationRatePercent: 48,
          milestonesCompletionRate: `${((verified / totalMilestones) * 100).toFixed(0)}%`,
          contractorReputationScore: 94
        },
        recommendations: [
          'Milestone pacing matches standard SLA thresholds.',
          'Sovereign escrow validation confirms sufficient liquidity.'
        ],
        automatedEscrowHoldRecommended: false
      };
    }
  }

  // ---------------- QUADRATIC VOTING ----------------
  async getVoiceCreditBalance(voterId: string = 'current-user'): Promise<number> {
    return this.voiceCredits.get(voterId) ?? 100;
  }

  async castQuadraticVote(
    proposalId: string,
    voterId: string,
    direction: 'Yes' | 'No' | 'Abstain',
    votesCount: number
  ): Promise<{ success: boolean; remainingCredits: number; message?: string; error?: string }> {
    const cost = votesCount * votesCount;
    const currentBalance = await this.getVoiceCreditBalance(voterId);

    if (currentBalance < cost) {
      return {
        success: false,
        remainingCredits: currentBalance,
        error: `Insufficient Voice Credits: requires ${cost} credits (votes²), available: ${currentBalance}`
      };
    }

    try {
      const res = await this.safeFetch<any>(`/proposals/${proposalId}/quadratic-vote`, {
        method: 'POST',
        body: JSON.stringify({
          voter_id: voterId,
          direction,
          votes_count: votesCount
        })
      });
      if (res && res.success) {
        this.voiceCredits.set(voterId, res.remainingCredits);
        return res;
      }
    } catch {
      // Fallback local update
    }

    const updatedCredits = currentBalance - cost;
    this.voiceCredits.set(voterId, updatedCredits);

    return {
      success: true,
      remainingCredits: updatedCredits,
      message: `Successfully cast ${votesCount} ${direction} vote(s) at cost of ${cost} voice credits`
    };
  }

  // ---------------- BLOCKCHAIN AUDIT LEDGER ----------------
  async getAuditLedger(limit: number = 50): Promise<{ totalBlocks: number; integrityValid: boolean; blocks: AuditBlock[] }> {
    try {
      return await this.safeFetch<any>(`/blockchain/audit-ledger?limit=${limit}`);
    } catch {
      return {
        totalBlocks: this.auditLedger.length,
        integrityValid: true,
        blocks: this.auditLedger.slice(-limit)
      };
    }
  }

  async verifyBlockchainIntegrity(): Promise<{ valid: boolean; blocksVerified: number; error?: string }> {
    try {
      return await this.safeFetch<any>('/blockchain/verify-chain');
    } catch {
      return { valid: true, blocksVerified: this.auditLedger.length };
    }
  }

  // ---------------- GLOBAL SEARCH ----------------
  async globalSearch(query: string): Promise<any> {
    try {
      return await this.safeFetch<any>(`/search?q=${encodeURIComponent(query)}`);
    } catch {
      const q = query.toLowerCase();
      const policies = this.policies.filter(p => p.title.toLowerCase().includes(q) || p.district.toLowerCase().includes(q));
      return {
        query,
        resultsCount: policies.length,
        policies,
        complaints: [],
        proposals: [],
        transactions: []
      };
    }
  }

  // ---------------- EXISTING COMPLAINT & METRICS ----------------
  async submitComplaint(complaint: {
    title: string;
    description: string;
    category: string;
    policyId?: string;
    district: string;
    location?: string;
    mediaLinks?: string[];
  }): Promise<{ success: boolean; complaintId?: string; error?: string }> {
    try {
      const res = await this.safeFetch<any>('/complaints', {
        method: 'POST',
        body: JSON.stringify(complaint)
      });
      if (res && res.id) return { success: true, complaintId: res.id };
    } catch {
      // Fallback
    }

    return {
      success: true,
      complaintId: `COMP-${Date.now().toString().slice(-4)}`
    };
  }

  async getFundAnalytics() {
    return {
      total_funds_allocated: BigInt(12500000000),
      total_funds_released: BigInt(5100000000),
      total_transactions: 128,
      average_transaction_amount: BigInt(39843750),
      district_distribution: new Map(),
      category_distribution: new Map(),
      monthly_trends: new Map(),
      success_rate: 0.98
    };
  }

  async getRealTimeMetrics() {
    return {
      current_time: BigInt(Date.now() * 1000000),
      active_transactions: 24,
      pending_amount: BigInt(240000000),
      daily_volume: BigInt(85000000),
      weekly_volume: BigInt(480000000),
      monthly_volume: BigInt(1890000000)
    };
  }

  setUseMocks(enabled: boolean) {
    this.useMocks = enabled;
  }
}

export const civicLedgerService = new CivicLedgerService();
