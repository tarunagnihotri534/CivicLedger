import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/common/GlassCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload,
  FileText,
  Code,
  Settings,
  Users,
  MapPin,
  IndianRupee,
  Save,
  Eye,
  Zap,
  CheckCircle,
  AlertCircle,
  Brain,
  Download,
  DollarSign,
  Activity,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { PolicyRiskAssessmentModal } from "@/components/dashboard/PolicyRiskAssessmentModal";

interface Policy {
  id: string;
  name: string;
  description: string;
  fundLimit: number;
  eligibilityCriteria: string;
  geoCoverage: string[];
  status: "draft" | "active" | "under-review";
  beneficiariesCount: number;
  createdDate: string;
}

export const PolicyMaker = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"create" | "manage" | "analytics">("create");
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedRiskPolicy, setSelectedRiskPolicy] = useState<Policy | null>(null);

  // Enhanced policy stats
  const policyStats = [
    { icon: FileText, label: "Total Policies", value: "42", change: "+6", color: "civic-blue" },
    { icon: Activity, label: "Active Policies", value: "31", change: "+4", color: "civic-green" },
    { icon: Users, label: "Beneficiaries", value: "2.1M", change: "+156K", color: "civic-purple" },
    { icon: DollarSign, label: "Total Budget", value: "₹127Cr", change: "+23Cr", color: "civic-gold" }
  ];

  const [policyForm, setPolicyForm] = useState({
    name: "",
    description: "",
    fundLimit: "",
    eligibility: "",
    kycType: "aadhaar",
    geoCoverage: [] as string[],
    pdfFile: null as File | null
  });
  const [nlpPreview, setNlpPreview] = useState("");

  // Mock existing policies
  const policies: Policy[] = [
    {
      id: "POL-001",
      name: "PM Awas Yojana - Phase 3",
      description: "Housing scheme for economically weaker sections",
      fundLimit: 500000,
      eligibilityCriteria: "Annual income < ₹3 Lakh, No existing house ownership",
      geoCoverage: ["North Delhi", "South Delhi"],
      status: "active",
      beneficiariesCount: 1250,
      createdDate: "2024-01-01"
    },
    {
      id: "POL-002", 
      name: "Digital Literacy Campaign",
      description: "Computer training for senior citizens",
      fundLimit: 25000,
      eligibilityCriteria: "Age > 60 years, Basic education required",
      geoCoverage: ["East Delhi"],
      status: "under-review",
      beneficiariesCount: 850,
      createdDate: "2024-01-15"
    }
  ];

  const districts = [
    "North Delhi", "South Delhi", "East Delhi", "West Delhi", 
    "Central Delhi", "New Delhi", "Shahdara", "North East Delhi"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPolicyForm(prev => ({ ...prev, pdfFile: file }));
      // Mock NLP processing
      setTimeout(() => {
        setNlpPreview(`
// Auto-generated Smart Contract Logic from PDF
struct Eligibility {
    min_age: u8 = 18,
    max_age: u8 = 65,
    annual_income_limit: u64 = 300000, // ₹3 Lakh
    existing_house: bool = false,
    kyc_verified: bool = true,
}

struct FundDistribution {
    max_amount_per_beneficiary: u64 = 500000, // ₹5 Lakh
    release_stages: Vec<u64> = [100000, 200000, 200000],
    verification_required: bool = true,
}

fn check_eligibility(applicant: &Citizen) -> bool {
    applicant.age >= Eligibility::min_age &&
    applicant.age <= Eligibility::max_age &&
    applicant.annual_income <= Eligibility::annual_income_limit &&
    !applicant.has_existing_house &&
    applicant.kyc_status == Verified
}
        `);
      }, 2000);
    }
  };

  const handleSavePolicy = () => {
    if (!policyForm.name || !policyForm.description || !policyForm.fundLimit) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Policy Created",
      description: "Your policy has been converted to a smart contract and is now under review",
    });

    // Reset form
    setPolicyForm({
      name: "",
      description: "",
      fundLimit: "",
      eligibility: "",
      kycType: "aadhaar",
      geoCoverage: [],
      pdfFile: null
    });
    setNlpPreview("");
  };

  const handleDistrictToggle = (district: string) => {
    setPolicyForm(prev => ({
      ...prev,
      geoCoverage: prev.geoCoverage.includes(district)
        ? prev.geoCoverage.filter(d => d !== district)
        : [...prev.geoCoverage, district]
    }));
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
          <h1 className="text-3xl font-bold mb-2">Policy Maker Dashboard</h1>
          <p className="text-muted-foreground">
            Create, configure, and manage government schemes as smart contracts
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === "create" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("create")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Policy
            </Button>
            <Button
              variant={activeTab === "manage" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("manage")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Policies
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("analytics")}
            >
              <Eye className="w-4 h-4 mr-2" />
              Analytics
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
          {activeTab === "create" && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Policy Creation Form */}
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-6">Create New Policy</h2>
                <div className="space-y-6">
                  {/* PDF Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Policy Document</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Upload PDF to auto-generate smart contract logic
                        </p>
                      </label>
                    </div>
                    {policyForm.pdfFile && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {policyForm.pdfFile.name} uploaded
                      </div>
                    )}
                  </div>

                  {/* Basic Information */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Policy Name *</label>
                    <Input
                      placeholder="e.g., PM Awas Yojana - Phase 4"
                      value={policyForm.name}
                      onChange={(e) => setPolicyForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <Textarea
                      placeholder="Describe the policy objectives and scope..."
                      value={policyForm.description}
                      onChange={(e) => setPolicyForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  {/* Fund Limit */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Fund Limit per Beneficiary (₹) *</label>
                    <Input
                      type="number"
                      placeholder="e.g., 500000"
                      value={policyForm.fundLimit}
                      onChange={(e) => setPolicyForm(prev => ({ ...prev, fundLimit: e.target.value }))}
                    />
                  </div>

                  {/* Eligibility Criteria */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Eligibility Logic *</label>
                    <Textarea
                      placeholder="Define eligibility criteria (e.g., age > 18, income < 300000, etc.)"
                      value={policyForm.eligibility}
                      onChange={(e) => setPolicyForm(prev => ({ ...prev, eligibility: e.target.value }))}
                      rows={2}
                    />
                  </div>

                  {/* KYC Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">KYC Type</label>
                    <select
                      className="w-full p-3 border rounded-lg bg-background"
                      value={policyForm.kycType}
                      onChange={(e) => setPolicyForm(prev => ({ ...prev, kycType: e.target.value }))}
                    >
                      <option value="aadhaar">Aadhaar Card</option>
                      <option value="pan">PAN Card</option>
                      <option value="voter">Voter ID</option>
                      <option value="passport">Passport</option>
                    </select>
                  </div>

                  {/* Geographic Coverage */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Geographic Coverage</label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {districts.map(district => (
                        <div key={district} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={district}
                            checked={policyForm.geoCoverage.includes(district)}
                            onChange={() => handleDistrictToggle(district)}
                            className="rounded"
                          />
                          <label htmlFor={district} className="text-sm">{district}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSavePolicy} className="w-full bg-gradient-civic" size="lg">
                    <Save className="w-5 h-5 mr-2" />
                    Create Smart Contract Policy
                  </Button>
                </div>
              </GlassCard>

              {/* NLP Preview */}
              <GlassCard className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="w-5 h-5 text-civic-blue" />
                  <h3 className="text-lg font-semibold">AI-Generated Smart Contract</h3>
                </div>
                {nlpPreview ? (
                  <div className="space-y-4">
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-xs">{nlpPreview}</pre>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Logic Validated
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Code
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-center text-muted-foreground">
                    <div>
                      <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Upload a PDF policy document to see</p>
                      <p>AI-generated smart contract logic</p>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {activeTab === "manage" && (
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Manage Existing Policies</h2>
              <div className="space-y-4">
                {policies.map((policy, index) => (
                  <motion.div
                    key={policy.id}
                    className="border rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{policy.name}</h3>
                            <p className="text-sm text-muted-foreground">{policy.description}</p>
                          </div>
                          <StatusBadge status={policy.status} />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                          <div>
                            <span className="text-muted-foreground block">Fund Limit</span>
                            <span className="font-medium flex items-center">
                              <IndianRupee className="w-3 h-3 mr-1" />
                              {(policy.fundLimit / 100000).toFixed(1)}L
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Beneficiaries</span>
                            <span className="font-medium flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {policy.beneficiariesCount.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Coverage</span>
                            <span className="font-medium flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {policy.geoCoverage.length} districts
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Created</span>
                            <span className="font-medium">
                              {new Date(policy.createdDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm"
                          onClick={() => setSelectedRiskPolicy(policy)}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          AI Risk Audit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1.5" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1.5" />
                          Config
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          {activeTab === "analytics" && (
            <div className="grid md:grid-cols-3 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-civic-green/10 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-civic-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Active Policies</h3>
                    <p className="text-2xl font-bold text-civic-green">
                      {policies.filter(p => p.status === "active").length}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Policies currently executing as smart contracts
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-civic-blue/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-civic-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Total Beneficiaries</h3>
                    <p className="text-2xl font-bold text-civic-blue">
                      {policies.reduce((sum, p) => sum + p.beneficiariesCount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Citizens enrolled across all schemes
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-civic-gold/10 rounded-full flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-civic-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Total Allocation</h3>
                    <p className="text-2xl font-bold text-civic-gold">
                      ₹{(policies.reduce((sum, p) => sum + (p.fundLimit * p.beneficiariesCount), 0) / 10000000).toFixed(1)}Cr
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total fund commitment across schemes
                </p>
              </GlassCard>
            </div>
          )}
        </motion.div>

        {selectedRiskPolicy && (
          <PolicyRiskAssessmentModal
            isOpen={Boolean(selectedRiskPolicy)}
            onClose={() => setSelectedRiskPolicy(null)}
            policyId={selectedRiskPolicy.id}
            policyTitle={selectedRiskPolicy.name}
          />
        )}
      </div>
    </Layout>
  );
};