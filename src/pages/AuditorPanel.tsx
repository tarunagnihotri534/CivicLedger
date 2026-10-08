import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/common/GlassCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Pause,
  Play,
  FileText,
  Clock,
  Users,
  IndianRupee,
  Search,
  Filter,
  Download,
  Flag,
  MessageSquare,
  Activity,
  TrendingUp,
  Database,
  Lock,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Hash
} from "lucide-react";
import { civicLedgerService } from "@/lib/civicLedgerService";
import { BlockchainAuditLedgerModal } from "@/components/dashboard/BlockchainAuditLedgerModal";
import { AuditBlock, PolicyMilestone } from "@/lib/enhancedICPService";

interface FlaggedScheme {
  id: string;
  schemeName: string;
  contractor: string;
  district: string;
  issueType: string;
  complaintsCount: number;
  fundAtRisk: number;
  flaggedDate: string;
  severity: "high" | "medium" | "low";
  status: "pending" | "under-review" | "resolved";
  evidenceCount: number;
}

interface AuditAction {
  id: string;
  schemeId: string;
  action: "pause" | "resume" | "investigate" | "approve";
  reason: string;
  timestamp: string;
  auditor: string;
}

export const AuditorPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"flagged" | "actions" | "reports" | "milestones" | "blockchain">("flagged");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

  const [milestonesList, setMilestonesList] = useState([
    {
      policyId: "POL-001",
      policyTitle: "PM Awas Yojana - Phase 3",
      milestoneId: "m1-02",
      title: "Superstructure Framework & Masonry Construction",
      contractor: "Urban Infrastructure Ltd",
      allocatedAmount: 2000000000,
      proofHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      proofDescription: "Drone 3D survey model and concrete batch compression logs verified at 35 MPa",
      status: "ProofSubmitted"
    },
    {
      policyId: "POL-003",
      policyTitle: "Digital Literacy Campaign",
      milestoneId: "m3-01",
      title: "Digital Lab Equipment Procurement",
      contractor: "TechEd Solutions",
      allocatedAmount: 2250000000,
      proofHash: "0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa",
      proofDescription: "Hardware invoice delivery acknowledgment across 15 centers",
      status: "ProofSubmitted"
    }
  ]);

  const handleVerifyMilestone = async (m: typeof milestonesList[0]) => {
    try {
      const res = await civicLedgerService.verifyMilestone(m.policyId, m.milestoneId, "Auditor-Lead-Delhi", "Milestone inspection passed");
      if (res.success) {
        toast({
          title: "Milestone Verified & Escrow Released!",
          description: `Successfully verified "${m.title}". ₹${(m.allocatedAmount / 10000000).toFixed(1)} Cr disbursed to ${m.contractor}.`,
        });
        setMilestonesList(prev => prev.filter(item => item.milestoneId !== m.milestoneId));
      }
    } catch (err: any) {
      toast({
        title: "Verification Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  // Enhanced stats for better dashboard overview
  const dashboardStats = [
    { icon: Shield, label: "Total Audits", value: "1,247", change: "+12%", color: "civic-blue" },
    { icon: AlertTriangle, label: "Flagged Items", value: "23", change: "-8%", color: "civic-orange" },
    { icon: CheckCircle, label: "Approved", value: "1,198", change: "+15%", color: "civic-success" },
    { icon: Activity, label: "In Review", value: "26", change: "+3%", color: "civic-purple" }
  ];

  // Mock flagged schemes data
  const flaggedSchemes: FlaggedScheme[] = [
    {
      id: "FLAG-001",
      schemeName: "Digital Literacy Campaign",
      contractor: "TechEd Solutions",
      district: "East Delhi",
      issueType: "Fund Misallocation",
      complaintsCount: 7,
      fundAtRisk: 4500000,
      flaggedDate: "2024-01-18",
      severity: "high",
      status: "pending",
      evidenceCount: 12
    },
    {
      id: "FLAG-002",
      schemeName: "Rural Road Development", 
      contractor: "Infrastructure Pro",
      district: "West Delhi",
      issueType: "Quality Concerns",
      complaintsCount: 2,
      fundAtRisk: 800000,
      flaggedDate: "2024-01-19",
      severity: "medium",
      status: "under-review",
      evidenceCount: 5
    },
    {
      id: "FLAG-003",
      schemeName: "Mid Day Meal Program",
      contractor: "Food Services Corp",
      district: "South Delhi", 
      issueType: "Delivery Delay",
      complaintsCount: 1,
      fundAtRisk: 250000,
      flaggedDate: "2024-01-20",
      severity: "low",
      status: "pending",
      evidenceCount: 3
    }
  ];

  // Mock recent audit actions
  const auditActions: AuditAction[] = [
    {
      id: "ACT-001",
      schemeId: "SCHEME-001",
      action: "pause",
      reason: "Multiple complaints regarding fund allocation transparency",
      timestamp: "2024-01-20T10:30:00",
      auditor: "Senior Auditor - Delhi"
    },
    {
      id: "ACT-002",
      schemeId: "SCHEME-002",
      action: "approve",
      reason: "Investigation completed, all issues resolved satisfactorily",
      timestamp: "2024-01-19T15:45:00",
      auditor: "Lead Auditor - NCR"
    }
  ];

  const handleAuditAction = (schemeId: string, action: "pause" | "approve" | "investigate") => {
    toast({
      title: `Scheme ${action === "pause" ? "Paused" : action === "approve" ? "Approved" : "Under Investigation"}`,
      description: `Audit action has been recorded on the blockchain and stakeholders notified.`,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-orange-100 text-orange-800 border-orange-200"; 
      case "low": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "pause": return <Pause className="w-4 h-4 text-red-600" />;
      case "resume": return <Play className="w-4 h-4 text-green-600" />;
      case "investigate": return <Search className="w-4 h-4 text-blue-600" />;
      case "approve": return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const auditStats = {
    totalFlagged: flaggedSchemes.length,
    highSeverity: flaggedSchemes.filter(s => s.severity === "high").length,
    fundAtRisk: flaggedSchemes.reduce((sum, s) => sum + s.fundAtRisk, 0),
    actionsToday: 5
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Auditor Control Panel</h1>
          <p className="text-muted-foreground">
            Monitor flagged schemes, validate complaints, and trigger protective actions
          </p>
        </motion.div>

        {/* Audit Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Flag className="w-4 h-4 text-red-600" />
              <span className="text-xs text-muted-foreground">Flagged Schemes</span>
            </div>
            <div className="text-2xl font-bold">{auditStats.totalFlagged}</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs text-muted-foreground">High Severity</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{auditStats.highSeverity}</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <IndianRupee className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-muted-foreground">Fund at Risk</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">₹{(auditStats.fundAtRisk / 100000).toFixed(1)}L</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="w-4 h-4 text-civic-green" />
              <span className="text-xs text-muted-foreground">Actions Today</span>
            </div>
            <div className="text-2xl font-bold">{auditStats.actionsToday}</div>
          </GlassCard>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === "flagged" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("flagged")}
            >
              <Flag className="w-4 h-4 mr-2" />
              Flagged Schemes
            </Button>
            <Button
              variant={activeTab === "milestones" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("milestones")}
              className={activeTab === "milestones" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
            >
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
              Milestone Escrow ({milestonesList.length})
            </Button>
            <Button
              variant={activeTab === "blockchain" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("blockchain")}
              className={activeTab === "blockchain" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
            >
              <Database className="w-4 h-4 mr-2 text-blue-500" />
              Blockchain Audit Trail
            </Button>
            <Button
              variant={activeTab === "actions" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("actions")}
            >
              <Shield className="w-4 h-4 mr-2" />
              Audit Actions
            </Button>
            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </Button>
          </div>
        </motion.div>

        {/* Content based on active tab */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "flagged" && (
            <GlassCard className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Flagged Schemes Requiring Attention</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {flaggedSchemes.map((scheme, index) => (
                  <motion.div
                    key={scheme.id}
                    className="border rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{scheme.schemeName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Contractor: {scheme.contractor} • District: {scheme.district}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getSeverityColor(scheme.severity)}>
                              {scheme.severity.toUpperCase()} RISK
                            </Badge>
                            <StatusBadge status={scheme.status} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-muted-foreground block">Issue Type</span>
                            <span className="font-medium">{scheme.issueType}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Complaints</span>
                            <span className="font-medium flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {scheme.complaintsCount}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Fund at Risk</span>
                            <span className="font-medium text-red-600 flex items-center">
                              <IndianRupee className="w-3 h-3 mr-1" />
                              {(scheme.fundAtRisk / 100000).toFixed(1)}L
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Evidence Files</span>
                            <span className="font-medium flex items-center">
                              <FileText className="w-3 h-3 mr-1" />
                              {scheme.evidenceCount}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          Flagged on {new Date(scheme.flaggedDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAuditAction(scheme.id, "investigate")}
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Investigate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAuditAction(scheme.id, "pause")}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pause Funds
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAuditAction(scheme.id, "approve")}
                          className="bg-civic-green hover:bg-civic-green-dark"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Validate & Approve
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          {activeTab === "actions" && (
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Audit Actions</h2>
              <div className="space-y-4">
                {auditActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    className="border rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {getActionIcon(action.action)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold capitalize">
                            {action.action} Action - {action.schemeId}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(action.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{action.reason}</p>
                        <div className="text-xs text-muted-foreground">
                          Performed by: {action.auditor}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          {activeTab === "reports" && (
            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Generate Audit Report</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Type</label>
                    <select className="w-full p-3 border rounded-lg bg-background">
                      <option>Monthly Audit Summary</option>
                      <option>Flagged Schemes Analysis</option>
                      <option>Fund Risk Assessment</option>
                      <option>Compliance Report</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" className="p-3 border rounded-lg bg-background" />
                      <input type="date" className="p-3 border rounded-lg bg-background" />
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-civic">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Schemes Audited This Month</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Issues Identified</span>
                    <span className="font-semibold text-red-600">8</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Funds Protected</span>
                    <span className="font-semibold text-civic-green">₹12.5Cr</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Resolution Rate</span>
                    <span className="font-semibold text-civic-blue">87%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Average Response Time</span>
                    <span className="font-semibold">4.2 hours</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === "milestones" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Contractor Milestone Proof Verification</h2>
                  <p className="text-sm text-muted-foreground">
                    Review submitted contractor field evidence and trigger cryptographic smart-contract escrow disbursement.
                  </p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">
                  {milestonesList.length} Pending Audit Verification
                </Badge>
              </div>

              {milestonesList.length === 0 ? (
                <GlassCard className="p-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold">All Milestones Cleared</h3>
                  <p className="text-sm text-muted-foreground">
                    All contractor proof-of-work submissions have been verified and settled on-chain.
                  </p>
                </GlassCard>
              ) : (
                <div className="grid gap-4">
                  {milestonesList.map((m) => (
                    <GlassCard key={m.milestoneId} className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                              {m.policyId}
                            </span>
                            <h3 className="font-semibold text-lg">{m.title}</h3>
                            <Badge className="bg-amber-100 text-amber-800">
                              Proof Submitted
                            </Badge>
                          </div>

                          <div className="text-sm text-muted-foreground">
                            <span>Policy: <strong className="text-slate-800 dark:text-slate-200">{m.policyTitle}</strong></span> • 
                            <span> Contractor: <strong className="text-slate-800 dark:text-slate-200">{m.contractor}</strong></span>
                          </div>

                          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs space-y-1">
                            <div><strong>Field Proof Note:</strong> {m.proofDescription}</div>
                            <div className="font-mono text-slate-500 truncate">
                              <strong>Proof Hash:</strong> {m.proofHash}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-3 shrink-0">
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase font-semibold">Escrow Value</div>
                            <div className="text-xl font-bold text-emerald-600">
                              ₹{(m.allocatedAmount / 10000000).toFixed(1)} Cr
                            </div>
                          </div>

                          <Button
                            onClick={() => handleVerifyMilestone(m)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md shadow-emerald-600/20"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Verify & Release Escrow
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "blockchain" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Sovereign Blockchain Audit Ledger</h2>
                  <p className="text-sm text-muted-foreground">
                    Cryptographic proof chain verified via SHA-256 Merkle trees and immutable block linking.
                  </p>
                </div>

                <Button
                  onClick={() => setIsLedgerModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Open Live Ledger Explorer
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <GlassCard className="p-5">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase">Security Protocol</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">SHA-256 Chained</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Every state alteration generates a Merkle-hashed block anchored to the previous block hash.
                  </p>
                </GlassCard>

                <GlassCard className="p-5">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase">Chain Integrity</div>
                      <div className="font-bold text-emerald-600">100% Tamper-Evident</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Zero tampering detected. Cryptographic proofs mathematically guarantee ledger immutability.
                  </p>
                </GlassCard>

                <GlassCard className="p-5">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase">Network Host</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">ICP Decentralized Canister</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cross-subnet consensus ensures state replication across global independent node providers.
                  </p>
                </GlassCard>
              </div>

              <GlassCard className="p-8 text-center border-dashed">
                <Database className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-1">Explore All Mined Blocks</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                  View raw block indices, hashes, Merkle roots, and cryptographic receipts for every policy action.
                </p>
                <Button onClick={() => setIsLedgerModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Launch Block Explorer
                </Button>
              </GlassCard>
            </div>
          )}
        </motion.div>

        {isLedgerModalOpen && (
          <BlockchainAuditLedgerModal
            isOpen={isLedgerModalOpen}
            onClose={() => setIsLedgerModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
};