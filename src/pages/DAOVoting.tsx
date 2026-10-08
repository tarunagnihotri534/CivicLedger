import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/common/GlassCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { SuccessAnimation } from "@/components/common/SuccessAnimation";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Vote,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  Timer,
  Coins,
  Award,
  Gavel,
  Activity,
  Sparkles
} from "lucide-react";
import { QuadraticVotingModal } from "@/components/governance/QuadraticVotingModal";

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  category: "funding" | "policy" | "governance";
  status: "active" | "passed" | "rejected" | "pending";
  votesFor: number;
  votesAgainst: number;
  totalVoters: number;
  requiredQuorum: number;
  timeRemaining: string;
  fundingAmount?: number;
  startDate: string;
  endDate: string;
}

export const DAOVoting = () => {
  const { toast } = useToast();
  const [userVotes, setUserVotes] = useState<Record<string, "for" | "against">>({});
  const [votingPower] = useState(250); // Mock voting power based on civic tokens
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedQuadraticProposal, setSelectedQuadraticProposal] = useState<Proposal | null>(null);

  // Enhanced voting stats
  const votingStats = [
    { icon: Gavel, label: "Active Proposals", value: "12", change: "+3", color: "civic-blue" },
    { icon: Users, label: "Total Voters", value: "8,547", change: "+234", color: "civic-green" },
    { icon: Coins, label: "Your Voting Power", value: votingPower.toString(), change: "+15", color: "civic-gold" },
    { icon: Activity, label: "Participation Rate", value: "84.2%", change: "+5.1%", color: "civic-purple" }
  ];

  const proposals: Proposal[] = [
    {
      id: "PROP-001",
      title: "Digital Identity Verification System",
      description: "Implement blockchain-based digital identity verification for all government scheme applications to reduce fraud and streamline KYC processes.",
      proposer: "TechGov Initiative",
      category: "policy",
      status: "active",
      votesFor: 15420,
      votesAgainst: 3250,
      totalVoters: 18670,
      requiredQuorum: 20000,
      timeRemaining: "2 days",
      startDate: "2024-01-15",
      endDate: "2024-01-25"
    },
    {
      id: "PROP-002", 
      title: "Emergency Fund for Disaster Relief",
      description: "Allocate ₹50 Crore emergency fund for immediate disaster relief operations with automated trigger mechanisms based on severity indices.",
      proposer: "Disaster Management Council",
      category: "funding",
      status: "active",
      votesFor: 22100,
      votesAgainst: 1890,
      totalVoters: 23990,
      requiredQuorum: 20000,
      timeRemaining: "5 days",
      fundingAmount: 500000000,
      startDate: "2024-01-12",
      endDate: "2024-01-22"
    },
    {
      id: "PROP-003",
      title: "Transparency Score Methodology Update",
      description: "Update the algorithm for calculating transparency scores to include more granular metrics and citizen feedback weightage.",
      proposer: "Governance Alliance",
      category: "governance", 
      status: "passed",
      votesFor: 28750,
      votesAgainst: 5200,
      totalVoters: 33950,
      requiredQuorum: 20000,
      timeRemaining: "Completed",
      startDate: "2024-01-05",
      endDate: "2024-01-15"
    },
    {
      id: "PROP-004",
      title: "Rural Connectivity Infrastructure",
      description: "Establish high-speed internet infrastructure in rural areas to enable better access to digital governance services.",
      proposer: "Digital India Foundation",
      category: "funding",
      status: "pending",
      votesFor: 8500,
      votesAgainst: 12300,
      totalVoters: 20800,
      requiredQuorum: 20000,
      timeRemaining: "12 hours",
      fundingAmount: 750000000,
      startDate: "2024-01-18",
      endDate: "2024-01-20"
    }
  ];

  const handleVote = (proposalId: string, vote: "for" | "against") => {
    setUserVotes(prev => ({ ...prev, [proposalId]: vote }));
    setShowSuccess(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "funding": return "bg-civic-gold/10 text-civic-gold border-civic-gold/20";
      case "policy": return "bg-civic-green/10 text-civic-green border-civic-green/20";
      case "governance": return "bg-civic-blue/10 text-civic-blue border-civic-blue/20";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected": return <XCircle className="w-4 h-4 text-red-600" />;
      case "active": return <Vote className="w-4 h-4 text-civic-blue" />;
      default: return <Clock className="w-4 h-4 text-orange-600" />;
    }
  };

  const daoStats = {
    totalProposals: proposals.length,
    activeProposals: proposals.filter(p => p.status === "active").length,
    totalVoters: 45230,
    treasuryBalance: 12500000000 // 125 Crore
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
          <h1 className="text-3xl font-bold mb-2">DAO Governance</h1>
          <p className="text-muted-foreground">
            Participate in decentralized decision-making for CivilLedger policies and funding
          </p>
        </motion.div>

        {/* DAO Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <FileText className="w-4 h-4 text-civic-green" />
              <span className="text-xs text-muted-foreground">Active Proposals</span>
            </div>
            <div className="text-2xl font-bold">{daoStats.activeProposals}</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-civic-blue" />
              <span className="text-xs text-muted-foreground">Total Voters</span>
            </div>
            <div className="text-2xl font-bold">{daoStats.totalVoters.toLocaleString()}</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Coins className="w-4 h-4 text-civic-gold" />
              <span className="text-xs text-muted-foreground">Your Voting Power</span>
            </div>
            <div className="text-2xl font-bold">{votingPower}</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-civic-green" />
              <span className="text-xs text-muted-foreground">Treasury</span>
            </div>
            <div className="text-2xl font-bold">₹{(daoStats.treasuryBalance / 10000000).toFixed(0)}Cr</div>
          </GlassCard>
        </motion.div>

        {/* User Voting Power Card */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-civic rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Civic Participant</h3>
                  <p className="text-sm text-muted-foreground">
                    Your voting power: {votingPower} tokens • Tier: Active Citizen
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-civic-green/10 text-civic-green">
                  ✓ KYC Verified
                </Badge>
                <Badge className="bg-civic-blue/10 text-civic-blue">
                  🗳️ 12 Votes Cast
                </Badge>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Proposals */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold">Active Proposals</h2>
          
          {proposals.map((proposal, index) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6" hoverable>
                <div className="space-y-4">
                  {/* Proposal Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold">{proposal.title}</h3>
                        <Badge className={getCategoryColor(proposal.category)}>
                          {proposal.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(proposal.status)}
                          <span className="text-sm capitalize font-medium">{proposal.status}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{proposal.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Proposed by: {proposal.proposer}</span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(proposal.startDate).toLocaleDateString()}
                        </span>
                        {proposal.fundingAmount && (
                          <span className="flex items-center text-civic-gold font-medium">
                            <Coins className="w-4 h-4 mr-1" />
                            ₹{(proposal.fundingAmount / 10000000).toFixed(0)} Cr
                          </span>
                        )}
                      </div>
                    </div>

                    {proposal.status === "active" && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Timer className="w-4 h-4 text-orange-600" />
                        <span className="font-medium">{proposal.timeRemaining} remaining</span>
                      </div>
                    )}
                  </div>

                  {/* Voting Results */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Voting Progress</span>
                      <span>{proposal.totalVoters.toLocaleString()} / {proposal.requiredQuorum.toLocaleString()} voters</span>
                    </div>
                    
                    <Progress 
                      value={(proposal.totalVoters / proposal.requiredQuorum) * 100} 
                      className="h-2"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">For</span>
                        </div>
                        <span className="font-bold text-green-600">
                          {proposal.votesFor.toLocaleString()} 
                          <span className="text-sm ml-1">
                            ({Math.round((proposal.votesFor / proposal.totalVoters) * 100)}%)
                          </span>
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium">Against</span>
                        </div>
                        <span className="font-bold text-red-600">
                          {proposal.votesAgainst.toLocaleString()}
                          <span className="text-sm ml-1">
                            ({Math.round((proposal.votesAgainst / proposal.totalVoters) * 100)}%)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Voting Actions */}
                  {proposal.status === "active" && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        {userVotes[proposal.id] ? (
                          <span className="flex items-center text-civic-green">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            You voted {userVotes[proposal.id] === "for" ? "in favor" : "against"}
                          </span>
                        ) : (
                          "Your vote matters - make it count!"
                        )}
                      </div>
                      
                      {!userVotes[proposal.id] && (
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => setSelectedQuadraticProposal(proposal)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-sm"
                          >
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            Quadratic Vote
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(proposal.id, "against")}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1.5" />
                            Against
                          </Button>
                          <AnimatedButton
                            size="sm"
                            variant="success"
                            onClick={() => handleVote(proposal.id, "for")}
                            glow
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            For
                          </AnimatedButton>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* How to Participate */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">How to Participate in DAO Governance</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-civic-green rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <h4 className="font-medium mb-1">Acquire Voting Power</h4>
                  <p className="text-muted-foreground">Earn civic tokens through verified participation in governance activities</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-civic-blue rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <h4 className="font-medium mb-1">Review Proposals</h4>
                  <p className="text-muted-foreground">Study each proposal carefully and consider its impact on governance</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-civic-gold rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <h4 className="font-medium mb-1">Cast Your Vote</h4>
                  <p className="text-muted-foreground">Vote on proposals to shape the future of transparent governance</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
        
        <SuccessAnimation
          isVisible={showSuccess}
          message="Your vote has been recorded on the blockchain! Thank you for participating in decentralized governance."
          onComplete={() => setShowSuccess(false)}
        />

        {selectedQuadraticProposal && (
          <QuadraticVotingModal
            isOpen={Boolean(selectedQuadraticProposal)}
            onClose={() => setSelectedQuadraticProposal(null)}
            proposalId={selectedQuadraticProposal.id}
            proposalTitle={selectedQuadraticProposal.title}
            onVoteCast={(votes, credits, direction) => {
              setUserVotes(prev => ({ 
                ...prev, 
                [selectedQuadraticProposal.id]: direction === 'Yes' ? 'for' : 'against' 
              }));
              setShowSuccess(true);
            }}
          />
        )}
      </div>
    </Layout>
  );
};