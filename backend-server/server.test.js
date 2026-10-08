const request = require('supertest');
const { app, dataStore, initializeData, verifyBlockchainIntegrity } = require('./server');

describe('CivicLedger Sovereign Backend API & Engine Tests', () => {
  beforeEach(() => {
    initializeData();
  });

  describe('System Health & Initialization', () => {
    test('GET /health returns healthy status, version, and ledger height', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.version).toBe('2.0.0');
      expect(res.body.blocksInLedger).toBeGreaterThan(0);
    });
  });

  describe('Smart Policies & Milestones Execution', () => {
    test('GET /api/policies returns list of initialized policies', async () => {
      const res = await request(app).get('/api/policies');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(res.body[0]).toHaveProperty('milestones');
    });

    test('POST /api/policies registers new policy with automatic milestone pipeline', async () => {
      const newPolicy = {
        title: "Clean Water Infrastructure Initiative",
        description: "Drinking water filtration plants across 50 villages",
        category: "Water & Sanitation",
        fund_allocation: "1000000000",
        district: "East Delhi",
        contractor: "AquaTech Enterprises"
      };

      const res = await request(app).post('/api/policies').send(newPolicy);
      expect(res.status).toBe(201);
      expect(res.body.title).toBe(newPolicy.title);
      expect(res.body.milestones.length).toBe(3);
      expect(dataStore.policies.has(res.body.id)).toBe(true);
    });

    test('POST /api/policies/:id/milestones/:milestoneId/submit-proof allows contractor to submit proof-of-work', async () => {
      const policies = Array.from(dataStore.policies.values());
      const policy = policies[0];
      const pendingMilestone = policy.milestones.find(m => m.status === 'Pending' || m.status === 'ProofSubmitted');

      const proofData = {
        proof_description: "Foundation concrete load test verified at 45 MPa",
        proof_hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890",
        geo_coordinates: { lat: 28.6139, lng: 77.2090 }
      };

      const res = await request(app)
        .post(`/api/policies/${policy.id}/milestones/${pendingMilestone.id}/submit-proof`)
        .send(proofData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.milestone.status).toBe('ProofSubmitted');
      expect(res.body.milestone.proof_hash).toBe(proofData.proof_hash);
    });

    test('POST /api/policies/:id/milestones/:milestoneId/verify auditor verifies milestone and triggers smart fund release', async () => {
      const policies = Array.from(dataStore.policies.values());
      const policy = policies[0];
      const milestone = policy.milestones.find(m => !m.disbursed);

      const beforeReleased = policy.fund_released;

      const res = await request(app)
        .post(`/api/policies/${policy.id}/milestones/${milestone.id}/verify`)
        .send({
          auditor_id: "Gov-Senior-Auditor-Delhi",
          remarks: "Field inspection passed with top structural grade"
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.milestone.status).toBe('Verified');
      expect(res.body.transaction).toBeDefined();

      const updatedPolicy = dataStore.policies.get(policy.id);
      expect(updatedPolicy.fund_released).toBe(beforeReleased + milestone.allocated_amount);
    });
  });

  describe('AI Policy Risk Assessment', () => {
    test('GET /api/policies/:id/risk-assessment calculates multi-factor risk score and recommendations', async () => {
      const policies = Array.from(dataStore.policies.values());
      const policy = policies[0];

      const res = await request(app).get(`/api/policies/${policy.id}/risk-assessment`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('riskScore');
      expect(res.body).toHaveProperty('riskLevel');
      expect(res.body).toHaveProperty('factors');
      expect(Array.isArray(res.body.recommendations)).toBe(true);
    });
  });

  describe('DAO & Quadratic Voting Engine', () => {
    test('POST /api/proposals creates new governance proposal', async () => {
      const proposalData = {
        title: "Deploy Automated Water Purity Sensors",
        description: "Install IoT water sensors for continuous smart contract compliance tracking",
        category: "Technology",
        proposer: "citizen-001"
      };

      const res = await request(app).post('/api/proposals').send(proposalData);
      expect(res.status).toBe(201);
      expect(res.body.title).toBe(proposalData.title);
    });

    test('POST /api/proposals/:id/quadratic-vote deducts credits quadratically (cost = votes^2)', async () => {
      const proposals = Array.from(dataStore.proposals.values());
      const proposal = proposals[0];

      // Initial voter balance for citizen-001 is 100 credits
      // Casting 4 votes should cost 4^2 = 16 credits
      const res = await request(app)
        .post(`/api/proposals/${proposal.id}/quadratic-vote`)
        .send({
          voter_id: "citizen-001",
          direction: "Yes",
          votes_count: 4
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.remainingCredits).toBe(84); // 100 - 16 = 84
    });

    test('POST /api/proposals/:id/quadratic-vote rejects when cost exceeds voice credit balance', async () => {
      const proposals = Array.from(dataStore.proposals.values());
      const proposal = proposals[0];

      // 12 votes requires 144 credits, but citizen-001 only has 100
      const res = await request(app)
        .post(`/api/proposals/${proposal.id}/quadratic-vote`)
        .send({
          voter_id: "citizen-001",
          direction: "Yes",
          votes_count: 12
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Insufficient voice credits');
    });
  });

  describe('Cryptographic Blockchain Audit Ledger & Immutability', () => {
    test('GET /api/blockchain/audit-ledger returns chained SHA-256 blocks', async () => {
      const res = await request(app).get('/api/blockchain/audit-ledger');
      expect(res.status).toBe(200);
      expect(res.body.integrityValid).toBe(true);
      expect(res.body.blocks.length).toBeGreaterThanOrEqual(1);

      const genesisBlock = res.body.blocks[0];
      expect(genesisBlock.eventType).toBe("GENESIS_BLOCK");
      expect(genesisBlock.previousHash).toBe('0'.repeat(64));
    });

    test('GET /api/blockchain/verify-chain verifies cryptographic block hashing end-to-end', async () => {
      const res = await request(app).get('/api/blockchain/verify-chain');
      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(true);
      expect(res.body.blocksVerified).toBe(dataStore.auditLedger.length);
    });

    test('verifyBlockchainIntegrity detects tampered block data', () => {
      expect(verifyBlockchainIntegrity().valid).toBe(true);

      // Artificially tamper with a block's payload without recalculating hash
      const originalPayload = dataStore.auditLedger[1].payload;
      dataStore.auditLedger[1].payload = { ...originalPayload, hacked: true };

      const check = verifyBlockchainIntegrity();
      expect(check.valid).toBe(false);
      expect(check.error).toContain('Corrupted Merkle root');

      // Revert tamper
      dataStore.auditLedger[1].payload = originalPayload;
      expect(verifyBlockchainIntegrity().valid).toBe(true);
    });
  });

  describe('Global Search & Analytics Overview', () => {
    test('GET /api/search finds matching policies and complaints', async () => {
      const res = await request(app).get('/api/search?q=Housing');
      expect(res.status).toBe(200);
      expect(res.body.policies.length).toBeGreaterThanOrEqual(1);
    });

    test('GET /api/analytics/overview returns aggregate treasury and governance KPIs', async () => {
      const res = await request(app).get('/api/analytics/overview');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalFundsAllocated');
      expect(res.body).toHaveProperty('totalFundsReleased');
      expect(res.body).toHaveProperty('auditBlocksTotal');
    });
  });
});
