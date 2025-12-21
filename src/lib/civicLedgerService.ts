
import { enhancedICPService, Policy, PolicyStatus } from './enhancedICPService';

// Mock data for development and demos
const MOCK_POLICIES: Policy[] = [
  {
    id: 'POL-001',
    title: 'PM Awas Yojana - Phase 3',
    description: 'Housing scheme for economically weaker sections',
    category: 'Housing',
    fund_allocation: BigInt(500000000),
    fund_released: BigInt(250000000),
    beneficiaries: 1250,
    status: PolicyStatus.Active,
    created_at: BigInt(1704067200000000000),
    updated_at: BigInt(Date.now() * 1000000),
    district: 'North Delhi',
    contractor: 'Urban Infrastructure Ltd',
    eligibility_criteria: ['Annual income < ₹3 Lakh', 'No existing house ownership'],
    execution_conditions: ['KYC verified', 'Funds available'],
    smart_contract_code: '',
    blockchain_hash: '0xabc123...',
    icp_transaction_id: 'ICP_TX_001',
    audit_trail: [],
    ai_analysis_score: 0.92,
    transparency_score: 0.96,
    citizen_approval_rate: 0.88,
  },
  {
    id: 'POL-002',
    title: 'Mid Day Meal Program',
    description: 'Nutritious meals for school children',
    category: 'Education',
    fund_allocation: BigInt(300000000),
    fund_released: BigInt(180000000),
    beneficiaries: 5400,
    status: PolicyStatus.Active,
    created_at: BigInt(1704153600000000000),
    updated_at: BigInt(Date.now() * 1000000),
    district: 'South Delhi',
    contractor: 'Food Services Corp',
    eligibility_criteria: ['School going children', 'Age 6-14 years'],
    execution_conditions: ['School registration', 'Food quality certification'],
    smart_contract_code: '',
    blockchain_hash: '0xdef456...',
    icp_transaction_id: 'ICP_TX_002',
    audit_trail: [],
    ai_analysis_score: 0.89,
    transparency_score: 0.94,
    citizen_approval_rate: 0.91,
  },
  {
    id: 'POL-003',
    title: 'Digital Literacy Campaign',
    description: 'Computer training for senior citizens',
    category: 'Technology',
    fund_allocation: BigInt(450000000),
    fund_released: BigInt(80000000),
    beneficiaries: 850,
    status: PolicyStatus.Paused,
    created_at: BigInt(1704240000000000000),
    updated_at: BigInt(Date.now() * 1000000),
    district: 'East Delhi',
    contractor: 'TechEd Solutions',
    eligibility_criteria: ['Age > 60 years', 'Basic education required'],
    execution_conditions: ['Training center setup', 'Instructor availability'],
    smart_contract_code: '',
    blockchain_hash: '0xghi789...',
    icp_transaction_id: 'ICP_TX_003',
    audit_trail: [],
    ai_analysis_score: 0.85,
    transparency_score: 0.88,
    citizen_approval_rate: 0.82,
  },
  {
    id: 'POL-004',
    title: 'Rural Road Development',
    description: 'Infrastructure for rural connectivity',
    category: 'Infrastructure',
    fund_allocation: BigInt(400000000),
    fund_released: BigInt(320000000),
    beneficiaries: 2100,
    status: PolicyStatus.UnderReview,
    created_at: BigInt(1704326400000000000),
    updated_at: BigInt(Date.now() * 1000000),
    district: 'West Delhi',
    contractor: 'Infrastructure Pro',
    eligibility_criteria: ['Rural area identification', 'Population density check'],
    execution_conditions: ['Land acquisition', 'Environmental clearance'],
    smart_contract_code: '',
    blockchain_hash: '0xjkl012...',
    icp_transaction_id: 'ICP_TX_004',
    audit_trail: [],
    ai_analysis_score: 0.88,
    transparency_score: 0.93,
    citizen_approval_rate: 0.86,
  },
];

class CivicLedgerService {
  private useMocks: boolean = true; // Toggle this to use real ICP

  async getAllPolicies(): Promise<Policy[]> {
    if (this.useMocks) {
      return Promise.resolve(MOCK_POLICIES);
    }

    try {
      const policies = await enhancedICPService.getWCHL25Metrics();
      // Convert and return policies
      return MOCK_POLICIES; // Fallback for now
    } catch (error) {
      console.error('Failed to fetch policies:', error);
      return MOCK_POLICIES;
    }
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
    executionConditions: string[]
  ): Promise<{ success: boolean; policyId?: string; error?: string }> {
    if (this.useMocks) {
      // Return mock success
      return {
        success: true,
        policyId: `POL-${Date.now()}`,
      };
    }

    try {
      return await enhancedICPService.registerPolicy(
        title,
        description,
        category,
        fundAllocation,
        district,
        eligibilityCriteria,
        executionConditions
      );
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async activatePolicy(policyId: string): Promise<{ success: boolean; error?: string }> {
    if (this.useMocks) {
      return { success: true };
    }

    // Implement real activation
    return { success: true };
  }

  async releaseFunds(
    policyId: string,
    amount: bigint,
    toAddress: string
  ): Promise<{ success: boolean; error?: string }> {
    if (this.useMocks) {
      return { success: true };
    }

    // Implement real fund release
    return { success: true };
  }

  // Complaint methods
  async submitComplaint(complaint: {
    title: string;
    description: string;
    category: string;
    policyId?: string;
    district: string;
    location?: string;
    mediaLinks?: string[];
  }): Promise<{ success: boolean; complaintId?: string; error?: string }> {
    if (this.useMocks) {
      return {
        success: true,
        complaintId: `COMP-${Date.now()}`,
      };
    }

    return { success: true };
  }

  // DAO Voting methods
  async createProposal(proposal: {
    title: string;
    description: string;
    category: string;
    votingDurationHours: number;
    quorumRequired: number;
  }): Promise<{ success: boolean; proposalId?: string; error?: string }> {
    if (this.useMocks) {
      return {
        success: true,
        proposalId: `PROP-${Date.now()}`,
      };
    }

    return { success: true };
  }

  async castVote(
    proposalId: string,
    voter: string,
    voteType: 'Yes' | 'No' | 'Abstain',
    votingPower: number
  ): Promise<{ success: boolean; error?: string }> {
    if (this.useMocks) {
      return { success: true };
    }

    return { success: true };
  }

  // Fund tracking methods
  async getFundAnalytics() {
    if (this.useMocks) {
      return {
        total_funds_allocated: BigInt(1650000000),
        total_funds_released: BigInt(830000000),
        total_transactions: 45,
        average_transaction_amount: BigInt(18444444),
        district_distribution: new Map(),
        category_distribution: new Map(),
        monthly_trends: new Map(),
        success_rate: 0.96,
      };
    }

    return {
      total_funds_allocated: BigInt(0),
      total_funds_released: BigInt(0),
      total_transactions: 0,
      average_transaction_amount: BigInt(0),
      district_distribution: new Map(),
      category_distribution: new Map(),
      monthly_trends: new Map(),
      success_rate: 0.0,
    };
  }

  async getRealTimeMetrics() {
    if (this.useMocks) {
      return {
        current_time: BigInt(Date.now() * 1000000),
        active_transactions: 12,
        pending_amount: BigInt(120000000),
        daily_volume: BigInt(45000000),
        weekly_volume: BigInt(312000000),
        monthly_volume: BigInt(1250000000),
      };
    }

    return {
      current_time: BigInt(0),
      active_transactions: 0,
      pending_amount: BigInt(0),
      daily_volume: BigInt(0),
      weekly_volume: BigInt(0),
      monthly_volume: BigInt(0),
    };
  }

  // Enable/disable mocks
  setUseMocks(enabled: boolean) {
    this.useMocks = enabled;
  }
}

export const civicLedgerService = new CivicLedgerService();
