const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Global BigInt JSON serialization support
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors({
  origin: '*',
  credentials: true
}));

// Rate limiting (generous for dev/testing)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cryptographic Chained Ledger Helpers
const sha256 = (content) => {
  return crypto.createHash('sha256').update(typeof content === 'string' ? content : JSON.stringify(content)).digest('hex');
};

// In-memory data storage (simulating ICP stable storage & decentralized ledger)
const dataStore = {
  policies: new Map(),
  complaints: new Map(),
  proposals: new Map(),
  transactions: new Map(),
  users: new Map(),
  sessions: new Map(),
  auditLedger: [],
  voiceCredits: new Map() // voter_id -> balance
};

// Block creator for the immutable audit ledger
const createAuditBlock = (eventType, payload) => {
  const previousBlock = dataStore.auditLedger.length > 0 
    ? dataStore.auditLedger[dataStore.auditLedger.length - 1] 
    : null;
  const previousHash = previousBlock ? previousBlock.hash : '0'.repeat(64);
  const index = dataStore.auditLedger.length;
  const timestamp = Date.now();
  const merkleRoot = sha256(payload);
  const hash = sha256(`${index}-${timestamp}-${eventType}-${previousHash}-${merkleRoot}`);

  const block = {
    index,
    timestamp,
    eventType,
    payload,
    previousHash,
    merkleRoot,
    hash
  };

  dataStore.auditLedger.push(block);

  // Broadcast block mined to connected clients
  if (io) {
    io.emit('block_mined', block);
  }

  return block;
};

// Verifies integrity of the entire cryptographic chain
const verifyBlockchainIntegrity = () => {
  if (dataStore.auditLedger.length === 0) return { valid: true, blocksVerified: 0 };

  for (let i = 0; i < dataStore.auditLedger.length; i++) {
    const current = dataStore.auditLedger[i];
    const expectedPreviousHash = i === 0 ? '0'.repeat(64) : dataStore.auditLedger[i - 1].hash;

    if (current.previousHash !== expectedPreviousHash) {
      return {
        valid: false,
        error: `Broken hash link at block ${i}`,
        brokenBlockIndex: i
      };
    }

    const expectedMerkle = sha256(current.payload);
    if (current.merkleRoot !== expectedMerkle) {
      return {
        valid: false,
        error: `Corrupted Merkle root at block ${i}`,
        brokenBlockIndex: i
      };
    }

    const expectedHash = sha256(`${current.index}-${current.timestamp}-${current.eventType}-${current.previousHash}-${current.merkleRoot}`);
    if (current.hash !== expectedHash) {
      return {
        valid: false,
        error: `Invalid block hash at block ${i}`,
        brokenBlockIndex: i
      };
    }
  }

  return { valid: true, blocksVerified: dataStore.auditLedger.length };
};

// Initialize with rich sample data & Genesis block
const initializeData = () => {
  dataStore.policies.clear();
  dataStore.complaints.clear();
  dataStore.proposals.clear();
  dataStore.transactions.clear();
  dataStore.auditLedger = [];
  dataStore.voiceCredits.clear();

  // Genesis Block
  createAuditBlock("GENESIS_BLOCK", {
    protocol: "CivicLedger Sovereign Policy Engine",
    genesisTime: new Date().toISOString(),
    network: "ICP Decentralized Subnet"
  });

  // Default voter voice credits for quadratic voting
  dataStore.voiceCredits.set("citizen-001", 100);
  dataStore.voiceCredits.set("citizen-002", 150);
  dataStore.voiceCredits.set("citizen-003", 200);

  // Sample policies with milestones
  const policy1 = {
    id: "POL-001",
    title: "PM Awas Yojana - Phase 3",
    description: "Housing for All scheme providing affordable housing to urban poor",
    category: "Housing",
    fund_allocation: 5000000000n, // 5 crore
    fund_released: 2500000000n, // 2.5 crore
    beneficiaries: 1250,
    status: "Active",
    created_at: BigInt(Date.now() * 1000000),
    updated_at: BigInt(Date.now() * 1000000),
    district: "North Delhi",
    contractor: "Urban Infrastructure Ltd",
    eligibility_criteria: ["Below Poverty Line", "Urban residence", "No existing house"],
    execution_conditions: ["House completion within 18 months", "Quality standards compliance"],
    smart_contract_code: "// Smart contract for PM Awas Yojana\ncontract PMAYContract {\n    // Implementation details\n}",
    transparency_score: 96,
    citizen_approval_rate: 91,
    milestones: [
      {
        id: "m1-01",
        title: "Topographic Survey & Foundation",
        description: "Geotechnical clearance and concrete foundation laying for 300 units",
        allocated_amount: 1500000000n,
        percentage: 30,
        status: "Verified",
        proof_hash: "0x7a8b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b",
        proof_description: "Foundation inspection report signed by structural engineer",
        submitted_at: BigInt((Date.now() - 30 * 86400000) * 1000000),
        verified_by: "Auditor-Chief-01",
        verified_at: BigInt((Date.now() - 25 * 86400000) * 1000000),
        disbursed: true
      },
      {
        id: "m1-02",
        title: "Structural Frame & Roofing",
        description: "Superstructure completion and weather-sealed roof trusses",
        allocated_amount: 2000000000n,
        percentage: 40,
        status: "ProofSubmitted",
        proof_hash: "0x3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a",
        proof_description: "Drone structural scan and safety certification report",
        submitted_at: BigInt(Date.now() * 1000000),
        verified_by: null,
        verified_at: null,
        disbursed: false
      },
      {
        id: "m1-03",
        title: "Finishing, Utilities & Citizen Handover",
        description: "Plumbing, electrical grid connection, and biometric citizen sign-off",
        allocated_amount: 1500000000n,
        percentage: 30,
        status: "Pending",
        proof_hash: null,
        proof_description: null,
        submitted_at: null,
        verified_by: null,
        verified_at: null,
        disbursed: false
      }
    ]
  };

  const policy2 = {
    id: "POL-002",
    title: "Digital India Infrastructure",
    description: "Building digital infrastructure across rural areas",
    category: "Technology",
    fund_allocation: 3000000000n, // 3 crore
    fund_released: 1500000000n, // 1.5 crore
    beneficiaries: 500,
    status: "Active",
    created_at: BigInt(Date.now() * 1000000),
    updated_at: BigInt(Date.now() * 1000000),
    district: "South Delhi",
    contractor: "Tech Solutions Inc",
    eligibility_criteria: ["Rural areas", "No internet connectivity"],
    execution_conditions: ["Fiber optic installation", "WiFi hotspot setup"],
    smart_contract_code: "// Smart contract for Digital India\ncontract DigitalIndiaContract {\n    // Implementation details\n}",
    transparency_score: 93,
    citizen_approval_rate: 88,
    milestones: [
      {
        id: "m2-01",
        title: "Backhaul Fiber Laying",
        description: "High-capacity optical fiber deployment along rural highway corridors",
        allocated_amount: 1500000000n,
        percentage: 50,
        status: "Verified",
        proof_hash: "0x11223344556677889900aabbccddeeff00112233",
        proof_description: "OTDR fiber loss test certification passed",
        submitted_at: BigInt((Date.now() - 15 * 86400000) * 1000000),
        verified_by: "Auditor-Telecom-02",
        verified_at: BigInt((Date.now() - 10 * 86400000) * 1000000),
        disbursed: true
      },
      {
        id: "m2-02",
        title: "Community WiFi Hub Activation",
        description: "Solar-powered public access hotspots across 40 panchayats",
        allocated_amount: 1500000000n,
        percentage: 50,
        status: "Pending",
        proof_hash: null,
        proof_description: null,
        submitted_at: null,
        verified_by: null,
        verified_at: null,
        disbursed: false
      }
    ]
  };

  dataStore.policies.set(policy1.id, policy1);
  dataStore.policies.set(policy2.id, policy2);

  createAuditBlock("POLICY_REGISTERED", { policyId: policy1.id, title: policy1.title, budget: policy1.fund_allocation.toString() });
  createAuditBlock("POLICY_REGISTERED", { policyId: policy2.id, title: policy2.title, budget: policy2.fund_allocation.toString() });

  // Sample complaints
  const complaint1 = {
    id: "COMP-001",
    title: "Delayed Construction Work",
    description: "PM Awas Yojana construction has been delayed by 3 months in sector 4",
    category: "Infrastructure",
    priority: "High",
    status: "UnderReview",
    policy_id: policy1.id,
    district: "North Delhi",
    location: "Sector 4 Colony",
    media_links: ["photo1.jpg", "photo2.jpg"],
    citizen_id: "citizen-001",
    created_at: BigInt(Date.now() * 1000000),
    updated_at: BigInt(Date.now() * 1000000),
    ai_analysis: {
      sentiment: "negative",
      category_prediction: "construction_delay",
      priority_score: 0.8,
      suggested_action: "Investigate contractor milestone pacing",
      confidence: 0.88,
      keywords: ["delay", "construction", "timeline", "housing"]
    },
    audit_score: 0.75,
    resolution_time: null
  };

  dataStore.complaints.set(complaint1.id, complaint1);
  createAuditBlock("COMPLAINT_SUBMITTED", { complaintId: complaint1.id, policyId: policy1.id, category: complaint1.category });

  // Sample proposals with Quadratic Voting support
  const proposal1 = {
    id: "PROP-001",
    title: "Automated Satellite Validation for Rural Construction",
    description: "Integrate ISRO Bhuvan satellite imagery feeds into the smart contract execution engine to automate verification of foundation works.",
    category: "Technology",
    proposer: "citizen-002",
    created_at: BigInt(Date.now() * 1000000),
    voting_start: BigInt(Date.now() * 1000000),
    voting_end: BigInt(Date.now() * 1000000 + 7 * 24 * 3600 * 1000000000),
    status: "Active",
    yes_votes: 64,
    no_votes: 9,
    abstain_votes: 4,
    total_votes: 77,
    quorum_required: 50,
    quadratic_records: [
      { voter: "citizen-001", direction: "Yes", votesCount: 6, creditsCost: 36 },
      { voter: "citizen-002", direction: "Yes", votesCount: 5, creditsCost: 25 },
      { voter: "citizen-003", direction: "No", votesCount: 3, creditsCost: 9 }
    ]
  };

  dataStore.proposals.set(proposal1.id, proposal1);
  createAuditBlock("PROPOSAL_CREATED", { proposalId: proposal1.id, title: proposal1.title });

  // Sample transactions
  const tx1 = {
    id: "TX-" + uuidv4().substring(0, 8),
    policy_id: policy1.id,
    transaction_type: "Allocation",
    amount: 5000000000n,
    from_address: "central_treasury_vault",
    to_address: "escrow_contract_pmay",
    timestamp: BigInt(Date.now() * 1000000),
    status: "Completed",
    transaction_hash: "0x" + crypto.randomBytes(16).toString('hex'),
    metadata: [["purpose", "initial_allocation"], ["scheme", "pmay"]]
  };

  const tx2 = {
    id: "TX-" + uuidv4().substring(0, 8),
    policy_id: policy1.id,
    transaction_type: "MilestoneRelease",
    amount: 1500000000n,
    from_address: "escrow_contract_pmay",
    to_address: "contractor_urban_infra",
    timestamp: BigInt(Date.now() * 1000000),
    status: "Completed",
    transaction_hash: "0x" + crypto.randomBytes(16).toString('hex'),
    metadata: [["purpose", "milestone_1_completion"], ["milestone_id", "m1-01"]]
  };

  dataStore.transactions.set(tx1.id, tx1);
  dataStore.transactions.set(tx2.id, tx2);

  createAuditBlock("TREASURY_TRANSACTION", { txId: tx1.id, amount: tx1.amount.toString(), type: tx1.transaction_type });
  createAuditBlock("TREASURY_TRANSACTION", { txId: tx2.id, amount: tx2.amount.toString(), type: tx2.transaction_type });
};

// Initialize default data
initializeData();

// Utility helpers for serialization
const serializePolicy = (p) => ({
  ...p,
  fund_allocation: p.fund_allocation.toString(),
  fund_released: p.fund_released.toString(),
  created_at: p.created_at ? p.created_at.toString() : null,
  updated_at: p.updated_at ? p.updated_at.toString() : null,
  milestones: (p.milestones || []).map(m => ({
    ...m,
    allocated_amount: m.allocated_amount ? m.allocated_amount.toString() : "0",
    submitted_at: m.submitted_at ? m.submitted_at.toString() : null,
    verified_at: m.verified_at ? m.verified_at.toString() : null
  }))
});

const serializeComplaint = (c) => ({
  ...c,
  created_at: c.created_at ? c.created_at.toString() : null,
  updated_at: c.updated_at ? c.updated_at.toString() : null,
  resolution_time: c.resolution_time ? c.resolution_time.toString() : null
});

const serializeProposal = (p) => ({
  ...p,
  created_at: p.created_at ? p.created_at.toString() : null,
  voting_start: p.voting_start ? p.voting_start.toString() : null,
  voting_end: p.voting_end ? p.voting_end.toString() : null
});

const serializeTransaction = (t) => ({
  ...t,
  amount: t.amount.toString(),
  timestamp: t.timestamp ? t.timestamp.toString() : null
});

// Socket.IO event listeners
io.on('connection', (socket) => {
  socket.emit('connected', { 
    message: 'Connected to CivicLedger Real-Time Engine',
    ledgerHeight: dataStore.auditLedger.length 
  });

  socket.on('subscribe_policies', () => {
    socket.join('policies');
    socket.emit('policies_update', Array.from(dataStore.policies.values()).map(serializePolicy));
  });

  socket.on('subscribe_complaints', () => {
    socket.join('complaints');
    socket.emit('complaints_update', Array.from(dataStore.complaints.values()).map(serializeComplaint));
  });

  socket.on('subscribe_proposals', () => {
    socket.join('proposals');
    socket.emit('proposals_update', Array.from(dataStore.proposals.values()).map(serializeProposal));
  });

  socket.on('subscribe_transactions', () => {
    socket.join('transactions');
    socket.emit('transactions_update', Array.from(dataStore.transactions.values()).map(serializeTransaction));
  });

  socket.on('subscribe_ledger', () => {
    socket.join('ledger');
    socket.emit('ledger_update', dataStore.auditLedger);
  });
});

// ==================== REST API ROUTES ====================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    service: 'CivicLedger Sovereign Engine',
    blocksInLedger: dataStore.auditLedger.length,
    activePolicies: Array.from(dataStore.policies.values()).filter(p => p.status === 'Active').length
  });
});

// ----------------- SMART POLICY ROUTES -----------------
app.get('/api/policies', (req, res) => {
  try {
    const policies = Array.from(dataStore.policies.values()).map(serializePolicy);
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/policies/:id', (req, res) => {
  try {
    const policy = dataStore.policies.get(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    res.json(serializePolicy(policy));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/policies', (req, res) => {
  try {
    const {
      title,
      description,
      category,
      fund_allocation,
      district,
      contractor,
      eligibility_criteria,
      execution_conditions,
      milestones
    } = req.body;

    if (!title || !fund_allocation) {
      return res.status(400).json({ error: 'Title and fund_allocation are required' });
    }

    const allocationBigInt = BigInt(fund_allocation);
    const policyId = `POL-${Date.now().toString().slice(-6)}`;

    // Prepare milestones if supplied
    const formattedMilestones = (milestones || [
      {
        id: `m-${uuidv4().slice(0, 6)}`,
        title: "Initial Mobilization & Ground Setup",
        description: "Initial resource allocation and statutory clearances",
        allocated_amount: (allocationBigInt * 30n) / 100n,
        percentage: 30,
        status: "Pending",
        proof_hash: null,
        proof_description: null,
        submitted_at: null,
        verified_by: null,
        verified_at: null,
        disbursed: false
      },
      {
        id: `m-${uuidv4().slice(0, 6)}`,
        title: "Core Execution & Development",
        description: "Major milestone construction and physical delivery",
        allocated_amount: (allocationBigInt * 40n) / 100n,
        percentage: 40,
        status: "Pending",
        proof_hash: null,
        proof_description: null,
        submitted_at: null,
        verified_by: null,
        verified_at: null,
        disbursed: false
      },
      {
        id: `m-${uuidv4().slice(0, 6)}`,
        title: "Quality Audit & Citizen Handover",
        description: "Final site audit, grievance clearance, and public dedication",
        allocated_amount: (allocationBigInt * 30n) / 100n,
        percentage: 30,
        status: "Pending",
        proof_hash: null,
        proof_description: null,
        submitted_at: null,
        verified_by: null,
        verified_at: null,
        disbursed: false
      }
    ]).map((m, idx) => ({
      id: m.id || `m-${idx + 1}`,
      title: m.title || `Milestone ${idx + 1}`,
      description: m.description || "",
      allocated_amount: typeof m.allocated_amount === 'bigint' ? m.allocated_amount : BigInt(m.allocated_amount || 0),
      percentage: m.percentage || 33,
      status: m.status || "Pending",
      proof_hash: m.proof_hash || null,
      proof_description: m.proof_description || null,
      submitted_at: m.submitted_at || null,
      verified_by: m.verified_by || null,
      verified_at: m.verified_at || null,
      disbursed: Boolean(m.disbursed)
    }));

    const policy = {
      id: policyId,
      title,
      description: description || "",
      category: category || "General",
      fund_allocation: allocationBigInt,
      fund_released: 0n,
      beneficiaries: 0,
      status: "Active",
      created_at: BigInt(Date.now() * 1000000),
      updated_at: BigInt(Date.now() * 1000000),
      district: district || "National",
      contractor: contractor || null,
      eligibility_criteria: eligibility_criteria || [],
      execution_conditions: execution_conditions || [],
      smart_contract_code: `// Auto-generated Smart Contract for ${title}\ncontract ${title.replace(/\s+/g, '')}ExecutionEngine {\n  uint256 public constant TOTAL_BUDGET = ${fund_allocation};\n  // Automated milestone trigger\n}`,
      transparency_score: 95,
      citizen_approval_rate: 90,
      milestones: formattedMilestones
    };

    dataStore.policies.set(policy.id, policy);

    // Chained audit block
    createAuditBlock("POLICY_REGISTERED", {
      policyId: policy.id,
      title: policy.title,
      budget: policy.fund_allocation.toString(),
      district: policy.district
    });

    const serialized = serializePolicy(policy);
    io.to('policies').emit('policies_update', Array.from(dataStore.policies.values()).map(serializePolicy));

    res.status(201).json(serialized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/policies/:id/activate', (req, res) => {
  try {
    const policy = dataStore.policies.get(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });

    policy.status = "Active";
    policy.updated_at = BigInt(Date.now() * 1000000);

    createAuditBlock("POLICY_ACTIVATED", { policyId: policy.id, title: policy.title });

    const serialized = serializePolicy(policy);
    io.to('policies').emit('policies_update', Array.from(dataStore.policies.values()).map(serializePolicy));
    res.json(serialized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Direct fund release route
app.post('/api/policies/:id/release-funds', (req, res) => {
  try {
    const { amount, to_address, purpose } = req.body;
    const policy = dataStore.policies.get(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });

    const releaseAmount = BigInt(amount);
    if (policy.fund_released + releaseAmount > policy.fund_allocation) {
      return res.status(400).json({ error: 'Insufficient allocated funds available for release' });
    }

    policy.fund_released += releaseAmount;
    policy.updated_at = BigInt(Date.now() * 1000000);

    const tx = {
      id: "TX-" + uuidv4().substring(0, 8),
      policy_id: policy.id,
      transaction_type: "Release",
      amount: releaseAmount,
      from_address: "government_treasury",
      to_address: to_address || "contractor_wallet",
      timestamp: BigInt(Date.now() * 1000000),
      status: "Completed",
      transaction_hash: "0x" + crypto.randomBytes(16).toString('hex'),
      metadata: [["purpose", purpose || "direct_fund_release"], ["policy", policy.title]]
    };

    dataStore.transactions.set(tx.id, tx);

    createAuditBlock("FUNDS_RELEASED", {
      policyId: policy.id,
      amount: releaseAmount.toString(),
      txHash: tx.transaction_hash,
      recipient: tx.to_address
    });

    io.to('policies').emit('policies_update', Array.from(dataStore.policies.values()).map(serializePolicy));
    io.to('transactions').emit('transactions_update', Array.from(dataStore.transactions.values()).map(serializeTransaction));

    res.json({
      success: true,
      policy: serializePolicy(policy),
      transaction: serializeTransaction(tx)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------- MILESTONE ENHANCEMENT ROUTES -----------------
// Get milestones for a policy
app.get('/api/policies/:id/milestones', (req, res) => {
  try {
    const policy = dataStore.policies.get(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    const milestones = (policy.milestones || []).map(m => ({
      ...m,
      allocated_amount: m.allocated_amount ? m.allocated_amount.toString() : "0",
      submitted_at: m.submitted_at ? m.submitted_at.toString() : null,
      verified_at: m.verified_at ? m.verified_at.toString() : null
    }));
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contractor submits Proof-of-Work for a milestone
app.post('/api/policies/:id/milestones/:milestoneId/submit-proof', (req, res) => {
  try {
    const { proof_description, proof_hash, media_links, geo_coordinates } = req.body;
    const policy = dataStore.policies.get(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });

    const milestone = (policy.milestones || []).find(m => m.id === req.params.milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    if (milestone.disbursed) {
      return res.status(400).json({ error: 'Milestone funds already disbursed' });
    }

    const computedProofHash = proof_hash || ("0x" + crypto.createHash('sha256').update(proof_description + Date.now()).digest('hex'));

    milestone.status = "ProofSubmitted";
    milestone.proof_description = proof_description || "Field inspection and proof evidence provided";
    milestone.proof_hash = computedProofHash;
    milestone.submitted_at = BigInt(Date.now() * 1000000);
    milestone.media_links = media_links || [];
    milestone.geo_coordinates = geo_coordinates || null;

    policy.updated_at = BigInt(Date.now() * 1000000);

    createAuditBlock("MILESTONE_PROOF_SUBMITTED", {
      policyId: policy.id,
      milestoneId: milestone.id,
      proofHash: computedProofHash,
      submittedAt: new Date().toISOString()
    });

    io.to('policies').emit('policies_update', Array.from(dataStore.policies.values()).map(serializePolicy));

    res.json({
      success: true,
      message: 'Proof-of-work submitted successfully for audit verification',
      milestone: {
        ...milestone,
        allocated_amount: milestone.allocated_amount.toString(),
        submitted_at: milestone.submitted_at.toString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auditor or Smart Contract verifies milestone and automatically triggers fund release
app.post('/api/policies/:id/milestones/:milestoneId/verify', (req, res) => {
  try {
    const { auditor_id, remarks } = req.body;
    const policy = dataStore.policies.get(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });

    const milestone = (policy.milestones || []).find(m => m.id === req.params.milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    if (milestone.disbursed) {
      return res.status(400).json({ error: 'Milestone has already been verified and disbursed' });
    }

    // Verify and release
    milestone.status = "Verified";
    milestone.verified_by = auditor_id || "Lead-Auditor-Gov";
    milestone.verified_at = BigInt(Date.now() * 1000000);
    milestone.disbursed = true;

    // Disburse funds
    const disbursementAmount = milestone.allocated_amount;
    policy.fund_released += disbursementAmount;
    policy.updated_at = BigInt(Date.now() * 1000000);

    // Record transaction
    const tx = {
      id: "TX-MLST-" + uuidv4().substring(0, 8),
      policy_id: policy.id,
      transaction_type: "MilestoneAutomatedRelease",
      amount: disbursementAmount,
      from_address: "smart_contract_escrow",
      to_address: policy.contractor || "contractor_verified_account",
      timestamp: BigInt(Date.now() * 1000000),
      status: "Completed",
      transaction_hash: "0x" + crypto.randomBytes(16).toString('hex'),
      metadata: [
        ["milestone_id", milestone.id],
        ["milestone_title", milestone.title],
        ["auditor", milestone.verified_by],
        ["remarks", remarks || "Proof verified and accepted"]
      ]
    };

    dataStore.transactions.set(tx.id, tx);

    createAuditBlock("MILESTONE_VERIFIED_DISBURSED", {
      policyId: policy.id,
      milestoneId: milestone.id,
      amount: disbursementAmount.toString(),
      auditor: milestone.verified_by,
      txHash: tx.transaction_hash
    });

    io.to('policies').emit('policies_update', Array.from(dataStore.policies.values()).map(serializePolicy));
    io.to('transactions').emit('transactions_update', Array.from(dataStore.transactions.values()).map(serializeTransaction));

    res.json({
      success: true,
      message: 'Milestone verified and funds automatically disbursed via smart contract',
      policy: serializePolicy(policy),
      milestone: {
        ...milestone,
        allocated_amount: milestone.allocated_amount ? milestone.allocated_amount.toString() : "0",
        submitted_at: milestone.submitted_at ? milestone.submitted_at.toString() : null,
        verified_at: milestone.verified_at ? milestone.verified_at.toString() : null
      },
      transaction: serializeTransaction(tx)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------- AI RISK ASSESSMENT ROUTE -----------------
app.get('/api/policies/:id/risk-assessment', (req, res) => {
  try {
    const policy = dataStore.policies.get(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });

    // Multi-factor risk calculation
    const complaints = Array.from(dataStore.complaints.values()).filter(c => c.policy_id === policy.id);
    const criticalComplaints = complaints.filter(c => c.priority === 'Critical' || c.priority === 'High').length;
    
    const totalMilestones = (policy.milestones || []).length;
    const verifiedMilestones = (policy.milestones || []).filter(m => m.status === 'Verified').length;
    const pendingProofs = (policy.milestones || []).filter(m => m.status === 'Pending').length;

    const utilizationRate = policy.fund_allocation > 0n 
      ? Number(policy.fund_released * 100n / policy.fund_allocation) 
      : 0;

    // Algorithmic risk score (0: Perfect safety, 100: Critical hazard)
    let score = 15; // baseline
    if (criticalComplaints > 0) score += criticalComplaints * 18;
    if (utilizationRate > 80 && verifiedMilestones < totalMilestones / 2) score += 25;
    if (pendingProofs > 2) score += 10;
    if (score > 100) score = 99;

    let riskLevel = "Low";
    if (score >= 70) riskLevel = "Critical";
    else if (score >= 45) riskLevel = "Elevated";
    else if (score >= 25) riskLevel = "Moderate";

    const assessment = {
      policyId: policy.id,
      policyTitle: policy.title,
      riskScore: score,
      riskLevel,
      factors: {
        complaintsCount: complaints.length,
        criticalComplaintsCount: criticalComplaints,
        utilizationRatePercent: utilizationRate,
        milestonesCompletionRate: totalMilestones > 0 ? ((verifiedMilestones / totalMilestones) * 100).toFixed(1) + "%" : "100%",
        contractorReputationScore: 92
      },
      recommendations: [
        score >= 45 
          ? "Trigger independent on-site drone inspection before subsequent fund release." 
          : "Contractor pacing aligns with baseline SLA requirements.",
        criticalComplaints > 0 
          ? "Immediate grievance redressal required for high-priority citizen submissions." 
          : "Grievance threshold within standard operational safety boundaries."
      ],
      automatedEscrowHoldRecommended: score >= 70
    };

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------- CITIZEN COMPLAINT ROUTES -----------------
app.get('/api/complaints', (req, res) => {
  try {
    const complaints = Array.from(dataStore.complaints.values()).map(serializeComplaint);
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/complaints', (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      policy_id,
      district,
      location,
      media_links,
      citizen_id
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const complaint = {
      id: "COMP-" + Date.now().toString().slice(-6),
      title,
      description,
      category: category || "General",
      priority: priority || "Medium",
      status: "Submitted",
      policy_id: policy_id || null,
      district: district || "Unassigned",
      location: location || "",
      media_links: media_links || [],
      citizen_id: citizen_id || "citizen-anonymous",
      created_at: BigInt(Date.now() * 1000000),
      updated_at: BigInt(Date.now() * 1000000),
      ai_analysis: {
        sentiment: description.toLowerCase().includes("delay") || description.toLowerCase().includes("fraud") ? "negative" : "neutral",
        category_prediction: category || "Public Services",
        priority_score: priority === "Critical" ? 0.95 : priority === "High" ? 0.75 : 0.45,
        suggested_action: "Expedite field inspection team notification",
        confidence: 0.91,
        keywords: ["accountability", "governance", "public-funds"]
      },
      audit_score: 0.65,
      resolution_time: null
    };

    dataStore.complaints.set(complaint.id, complaint);

    createAuditBlock("COMPLAINT_SUBMITTED", {
      complaintId: complaint.id,
      policyId: complaint.policy_id,
      priority: complaint.priority
    });

    const serialized = serializeComplaint(complaint);
    io.to('complaints').emit('complaints_update', Array.from(dataStore.complaints.values()).map(serializeComplaint));

    res.status(201).json(serialized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------- DAO & QUADRATIC VOTING ROUTES -----------------
app.get('/api/proposals', (req, res) => {
  try {
    const proposals = Array.from(dataStore.proposals.values()).map(serializeProposal);
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/proposals', (req, res) => {
  try {
    const {
      title,
      description,
      category,
      proposer,
      voting_duration_hours,
      quorum_required
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const now = BigInt(Date.now() * 1000000);
    const durationHours = BigInt(voting_duration_hours || 72);
    const votingStart = now;
    const votingEnd = now + (durationHours * 3600n * 1000000000n);

    const proposal = {
      id: "PROP-" + Date.now().toString().slice(-6),
      title,
      description,
      category: category || "Governance",
      proposer: proposer || "citizen-initiator",
      created_at: now,
      voting_start: votingStart,
      voting_end: votingEnd,
      status: "Active",
      yes_votes: 0,
      no_votes: 0,
      abstain_votes: 0,
      total_votes: 0,
      quorum_required: quorum_required || 50,
      quadratic_records: []
    };

    dataStore.proposals.set(proposal.id, proposal);

    createAuditBlock("PROPOSAL_CREATED", {
      proposalId: proposal.id,
      title: proposal.title,
      proposer: proposal.proposer
    });

    const serialized = serializeProposal(proposal);
    io.to('proposals').emit('proposals_update', Array.from(dataStore.proposals.values()).map(serializeProposal));

    res.status(201).json(serialized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Quadratic Voting endpoint
app.post('/api/proposals/:id/quadratic-vote', (req, res) => {
  try {
    const { voter_id, direction, votes_count } = req.body;
    const proposal = dataStore.proposals.get(req.params.id);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const votes = parseInt(votes_count) || 1;
    if (votes <= 0) return res.status(400).json({ error: 'Votes must be at least 1' });

    // Quadratic Formula: Voice Credits Spent = votes^2
    const creditCost = votes * votes;
    const voter = voter_id || "citizen-anonymous";

    // Check or assign voter voice credits
    let balance = dataStore.voiceCredits.get(voter);
    if (balance === undefined) {
      balance = 100; // default initial grant
      dataStore.voiceCredits.set(voter, balance);
    }

    if (balance < creditCost) {
      return res.status(400).json({
        error: `Insufficient voice credits. Requires ${creditCost} credits, available: ${balance}`,
        required: creditCost,
        available: balance
      });
    }

    // Deduct voice credits
    dataStore.voiceCredits.set(voter, balance - creditCost);

    // Apply directional votes
    if (direction === "Yes") {
      proposal.yes_votes += votes;
    } else if (direction === "No") {
      proposal.no_votes += votes;
    } else {
      proposal.abstain_votes += votes;
    }

    proposal.total_votes += votes;

    if (!proposal.quadratic_records) proposal.quadratic_records = [];
    proposal.quadratic_records.push({
      voter,
      direction,
      votesCount: votes,
      creditsCost: creditCost,
      timestamp: Date.now()
    });

    createAuditBlock("QUADRATIC_VOTE_CAST", {
      proposalId: proposal.id,
      voter,
      direction,
      votes,
      creditsCost: creditCost
    });

    io.to('proposals').emit('proposals_update', Array.from(dataStore.proposals.values()).map(serializeProposal));

    res.json({
      success: true,
      message: `Successfully cast ${votes} ${direction} vote(s) using ${creditCost} voice credits`,
      remainingCredits: balance - creditCost,
      proposal: serializeProposal(proposal)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------- BLOCKCHAIN & AUDIT LEDGER ROUTES -----------------
// Retrieve the complete tamper-evident audit ledger
app.get('/api/blockchain/audit-ledger', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const ledger = dataStore.auditLedger.slice(-limit);
    const verification = verifyBlockchainIntegrity();

    res.json({
      totalBlocks: dataStore.auditLedger.length,
      integrityValid: verification.valid,
      blocks: ledger
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Full chain verification
app.get('/api/blockchain/verify-chain', (req, res) => {
  try {
    const verification = verifyBlockchainIntegrity();
    res.json({
      ...verification,
      timestamp: new Date().toISOString(),
      network: "ICP Decentralized Subnet"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------- TRANSACTIONS & GLOBAL SEARCH -----------------
app.get('/api/transactions', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const txs = Array.from(dataStore.transactions.values())
      .sort((a, b) => Number(b.timestamp - a.timestamp))
      .slice(0, limit)
      .map(serializeTransaction);
    res.json(txs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Instant global search across all entities
app.get('/api/search', (req, res) => {
  try {
    const query = (req.query.q || "").toLowerCase().trim();
    if (!query) {
      return res.json({ policies: [], complaints: [], proposals: [], transactions: [] });
    }

    const policies = Array.from(dataStore.policies.values())
      .filter(p => p.title.toLowerCase().includes(query) || (p.district && p.district.toLowerCase().includes(query)) || p.category.toLowerCase().includes(query))
      .map(serializePolicy);

    const complaints = Array.from(dataStore.complaints.values())
      .filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query) || c.id.toLowerCase().includes(query))
      .map(serializeComplaint);

    const proposals = Array.from(dataStore.proposals.values())
      .filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query))
      .map(serializeProposal);

    const transactions = Array.from(dataStore.transactions.values())
      .filter(t => t.id.toLowerCase().includes(query) || (t.transaction_hash && t.transaction_hash.toLowerCase().includes(query)))
      .map(serializeTransaction);

    res.json({
      query,
      resultsCount: policies.length + complaints.length + proposals.length + transactions.length,
      policies,
      complaints,
      proposals,
      transactions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------- ANALYTICS OVERVIEW -----------------
app.get('/api/analytics/overview', (req, res) => {
  try {
    const totalPolicies = dataStore.policies.size;
    const activePolicies = Array.from(dataStore.policies.values()).filter(p => p.status === "Active").length;
    const totalComplaints = dataStore.complaints.size;
    const pendingComplaints = Array.from(dataStore.complaints.values()).filter(c => c.status === "Submitted").length;
    const totalProposals = dataStore.proposals.size;
    const activeProposals = Array.from(dataStore.proposals.values()).filter(p => p.status === "Active").length;
    const totalTransactions = dataStore.transactions.size;

    const totalFundsAllocated = Array.from(dataStore.policies.values())
      .reduce((sum, p) => sum + p.fund_allocation, 0n);
    const totalFundsReleased = Array.from(dataStore.policies.values())
      .reduce((sum, p) => sum + p.fund_released, 0n);

    const formatBigIntStr = (val) => (Number(val) / 100000000).toFixed(2);

    res.json({
      totalPolicies,
      activePolicies,
      totalComplaints,
      pendingComplaints,
      totalProposals,
      activeProposals,
      totalTransactions,
      auditBlocksTotal: dataStore.auditLedger.length,
      totalFundsAllocated: formatBigIntStr(totalFundsAllocated),
      totalFundsReleased: formatBigIntStr(totalFundsReleased),
      utilizationRate: totalFundsAllocated > 0n 
        ? (Number(totalFundsReleased) / Number(totalFundsAllocated) * 100).toFixed(2) 
        : "0.00"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

// Only bind port when executed directly (not when required by Jest test suites)
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🚀 CivicLedger Sovereign Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🌐 WebSocket: ws://localhost:${PORT}`);
    console.log(`⛓️  Immutable Audit Blocks initialized: ${dataStore.auditLedger.length}`);
    console.log(`🏛️  CivicLedger = Trust through Transparency`);
  });
}

module.exports = {
  app,
  server,
  io,
  dataStore,
  initializeData,
  createAuditBlock,
  verifyBlockchainIntegrity
};