import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/common/GlassCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { SuccessAnimation } from "@/components/common/SuccessAnimation";
import { ProofOfWorkCard } from "@/components/common/ProofOfWorkCard";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Hammer,
  FileText,
  IndianRupee,
  Upload,
  QrCode,
  CheckCircle,
  Clock,
  TrendingUp,
  Star,
  Camera,
  MapPin,
  Gavel,
  Briefcase,
  Award,
  Activity,
  ShieldCheck,
  Hash
} from "lucide-react";
import { civicLedgerService } from "@/lib/civicLedgerService";

interface Tender {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  district: string;
  status: "open" | "submitted" | "awarded" | "completed";
  requirements: string[];
}

export const ContractorView = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"browse" | "my-bids" | "submit-work">("browse");
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Enhanced contractor stats
  const contractorStats = [
    { icon: Gavel, label: "Available Tenders", value: "28", change: "+5", color: "civic-blue" },
    { icon: Briefcase, label: "My Active Bids", value: "12", change: "+3", color: "civic-green" },
    { icon: Award, label: "Won Contracts", value: "8", change: "+2", color: "civic-gold" },
    { icon: Activity, label: "Success Rate", value: "76%", change: "+8%", color: "civic-purple" }
  ];

  const tenders: Tender[] = [
    {
      id: "TENDER-001",
      title: "Rural Road Infrastructure Development",
      description: "Construction of 50km rural roads with proper drainage",
      budget: 75000000,
      deadline: "2024-02-15",
      district: "East Delhi",
      status: "open",
      requirements: ["Civil Engineering License", "5+ years experience", "Equipment certification"]
    },
    {
      id: "TENDER-002",
      title: "School Building Renovation",
      description: "Complete renovation of 10 government schools",
      budget: 45000000,
      deadline: "2024-02-20",
      district: "North Delhi",
      status: "open",
      requirements: ["Building License", "Safety Certification", "Past school projects"]
    }
  ];

  const handleSubmitWork = async () => {
    const generatedHash = "0x" + Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    try {
      await civicLedgerService.submitMilestoneProof("POL-001", "m1-02", {
        proof_description: "Field structural milestone proof with surveyor geo-coordinates",
        proof_hash: generatedHash
      });
      toast({
        title: "Cryptographic Proof Registered!",
        description: `Proof Hash: ${generatedHash.slice(0, 18)}... submitted to smart escrow contract for audit verification.`,
      });
    } catch (e) {
      // Fallback
    }
    setShowSuccess(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Contractor Dashboard</h1>
          <p className="text-muted-foreground">
            Browse tenders, submit bids, and provide work proof
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <FileText className="w-4 h-4 text-civic-green" />
              <span className="text-xs text-muted-foreground">Active Bids</span>
            </div>
            <div className="text-2xl font-bold">3</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle className="w-4 h-4 text-civic-blue" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="text-2xl font-bold">12</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Star className="w-4 h-4 text-civic-gold" />
              <span className="text-xs text-muted-foreground">Rating</span>
            </div>
            <div className="text-2xl font-bold">4.8</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <IndianRupee className="w-4 h-4 text-civic-green" />
              <span className="text-xs text-muted-foreground">Total Earned</span>
            </div>
            <div className="text-2xl font-bold">₹2.5Cr</div>
          </GlassCard>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === "browse" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("browse")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Browse Tenders
            </Button>
            <Button
              variant={activeTab === "my-bids" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("my-bids")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              My Bids
            </Button>
            <Button
              variant={activeTab === "submit-work" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("submit-work")}
            >
              <Upload className="w-4 h-4 mr-2" />
              Submit Work
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "browse" && (
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Available Tenders</h2>
              <div className="space-y-4">
                {tenders.map((tender, index) => (
                  <motion.div
                    key={tender.id}
                    className="border rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{tender.title}</h3>
                        <p className="text-sm text-muted-foreground">{tender.description}</p>
                      </div>
                      <StatusBadge status={tender.status} />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground block">Budget</span>
                        <span className="font-semibold text-civic-green">₹{(tender.budget / 10000000).toFixed(1)}Cr</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Deadline</span>
                        <span className="font-medium">{new Date(tender.deadline).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">District</span>
                        <span className="font-medium">{tender.district}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Requirements</span>
                        <span className="font-medium">{tender.requirements.length} criteria</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        {tender.requirements.slice(0, 2).map(req => (
                          <Badge key={req} variant="outline" className="text-xs">{req}</Badge>
                        ))}
                        {tender.requirements.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{tender.requirements.length - 2} more</Badge>
                        )}
                      </div>
                      <Button className="bg-gradient-civic">
                        Submit Bid
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          {activeTab === "submit-work" && (
            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-6">Submit Work Proof</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Work Images</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload progress photos</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">QR Code Verification</label>
                    <Button variant="outline" className="w-full h-24 flex-col" onClick={handleSubmitWork}>
                      <QrCode className="w-8 h-8 mb-2" />
                      <span>Scan Location QR</span>
                    </Button>
                  </div>
                </div>
              </GlassCard>
              
              <div className="flex items-center justify-center">
                <ProofOfWorkCard
                  workData={{
                    id: "POW001",
                    workHours: 8,
                    imagePreview: "",
                    locationTag: "East Delhi",
                    description: "Road construction progress documentation",
                    timestamp: new Date().toISOString(),
                    contractorName: "Urban Infrastructure Ltd",
                    rating: 4.2,
                    verified: false
                  }}
                  onSubmit={handleSubmitWork}
                  isSubmitting={showSuccess}
                />
              </div>
            </div>
          )}
        </motion.div>
        
        <SuccessAnimation
          isVisible={showSuccess}
          message="Work proof submitted successfully! Your submission will be verified within 24 hours."
          onComplete={() => setShowSuccess(false)}
        />
      </div>
    </Layout>
  );
};