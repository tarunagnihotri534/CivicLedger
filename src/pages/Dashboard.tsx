
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/common/GlassCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AnalyticsPanel } from "@/components/common/AnalyticsPanel";



import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  CheckCircle,
  IndianRupee,
  Clock,
  Eye,
  Download,
  FileText,
  DollarSign,
  Activity,
  Mic,
  MicOff,
  BarChart3,
  Trophy
} from "lucide-react";

interface Scheme {
  id: string;
  name: string;
  contractor: string;
  district: string;
  fundAllocated: number;
  fundReleased: number;
  beneficiaries: number;
  complaints: number;
  status: "active" | "paused" | "under-review" | "completed";
  lastUpdate: string;
}

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [gamificationVisible, setGamificationVisible] = useState(true);

  // Update time every minute for real-time feel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced dashboard stats
  const dashboardStats = [
    { icon: FileText, label: "Active Schemes", value: "156", change: "+12%", color: "civic-blue" },
    { icon: DollarSign, label: "Total Budget", value: "₹24.7Cr", change: "+8.5%", color: "civic-green" },
    { icon: Users, label: "Beneficiaries", value: "2.1M", change: "+18%", color: "civic-purple" },
    { icon: Activity, label: "Execution Rate", value: "94.2%", change: "+2.1%", color: "civic-success" }
  ];

  // Mock scheme data
  const schemes: Scheme[] = [
    {
      id: "1",
      name: "PM Awas Yojana - Phase 3",
      contractor: "Urban Infrastructure Ltd",
      district: "North Delhi",
      fundAllocated: 5000000,
      fundReleased: 2500000,
      beneficiaries: 1250,
      complaints: 3,
      status: "active",
      lastUpdate: "2 hours ago"
    },
    {
      id: "2", 
      name: "Mid Day Meal Program",
      contractor: "Food Services Corp",
      district: "South Delhi",
      fundAllocated: 3000000,
      fundReleased: 1800000,
      beneficiaries: 5400,
      complaints: 1,
      status: "active",
      lastUpdate: "1 day ago"
    },
    {
      id: "3",
      name: "Digital Literacy Campaign",
      contractor: "TechEd Solutions",
      district: "East Delhi", 
      fundAllocated: 4500000,
      fundReleased: 800000,
      beneficiaries: 850,
      complaints: 7,
      status: "paused",
      lastUpdate: "3 days ago"
    },
    {
      id: "4",
      name: "Rural Road Development",
      contractor: "Infrastructure Pro",
      district: "West Delhi",
      fundAllocated: 4000000,
      fundReleased: 3200000,
      beneficiaries: 2100,
      complaints: 2,
      status: "under-review",
      lastUpdate: "5 hours ago"
    }
  ];

  const totalStats = {
    totalFunds: schemes.reduce((sum, scheme) => sum + scheme.fundAllocated, 0),
    releasedFunds: schemes.reduce((sum, scheme) => sum + scheme.fundReleased, 0),
    totalBeneficiaries: schemes.reduce((sum, scheme) => sum + scheme.beneficiaries, 0),
    totalComplaints: schemes.reduce((sum, scheme) => sum + scheme.complaints, 0),
    activeSchemes: schemes.filter(s => s.status === "active").length
  };

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || scheme.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Civic Policy Execution Tracker</h1>
              <p className="text-muted-foreground">
                Real-time DAO governance • Transparent fund flow • Citizen auditing
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Voice Summary Toggle */}
              <Button
                variant={voiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="flex items-center gap-2"
              >
                {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                Voice Summary
              </Button>
              
              {/* Gamification Toggle */}
              <Button
                variant={gamificationVisible ? "default" : "outline"}
                size="sm"
                onClick={() => setGamificationVisible(!gamificationVisible)}
                className="flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                Trust Score
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards with Gamification */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <IndianRupee className="w-4 h-4 text-civic-green" />
              <span className="text-xs text-muted-foreground">Total Funds</span>
            </div>
            <div className="text-lg font-bold">₹{(totalStats.totalFunds / 10000000).toFixed(1)}Cr</div>
            <motion.div 
              className="h-1 bg-civic-green/20 rounded-full mt-2"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <motion.div 
                className="h-full bg-civic-green rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </motion.div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-civic-blue" />
              <span className="text-xs text-muted-foreground">Released</span>
            </div>
            <div className="text-lg font-bold">₹{(totalStats.releasedFunds / 10000000).toFixed(1)}Cr</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-civic-green" />
              <span className="text-xs text-muted-foreground">Beneficiaries</span>
            </div>
            <div className="text-lg font-bold">{totalStats.totalBeneficiaries.toLocaleString()}</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle className="w-4 h-4 text-civic-green" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
            <div className="text-lg font-bold">{totalStats.activeSchemes}</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-2 mb-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Complaints</span>
            </div>
            <div className="text-lg font-bold text-red-600">{totalStats.totalComplaints}</div>
          </GlassCard>

          {/* Gamification Card */}
          {gamificationVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-4 bg-gradient-to-br from-civic-purple/10 to-civic-success/10 border-civic-purple/20">
                <div className="flex items-center space-x-2 mb-1">
                  <Trophy className="w-4 h-4 text-civic-purple" />
                  <span className="text-xs text-muted-foreground">Trust Score</span>
                </div>
                <div className="text-lg font-bold text-civic-purple">94.2</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs">Citizen XP</span>
                  <motion.div 
                    className="flex-1 h-1 bg-civic-purple/20 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1 }}
                  >
                    <motion.div 
                      className="h-full bg-civic-purple rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                    />
                  </motion.div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </motion.div>

        {/* Policy Execution Flow */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          
        </motion.div>

        {/* Role-Aware System */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          
        </motion.div>

        {/* District Intelligence Dashboard */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          
        </motion.div>

        {/* Enhanced Map Interface */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          
        </motion.div>

        {/* Impact Graphs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          
        </motion.div>

        {/* Analytics Panel */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <AnalyticsPanel />
        </motion.div>

        {/* Schemes Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6">
            {/* Table Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold">Active Schemes</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schemes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("active")}
                  >
                    Active
                  </Button>
                  <Button
                    variant={filterStatus === "paused" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("paused")}
                  >
                    Paused
                  </Button>
                </div>
                
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Schemes List */}
            <div className="space-y-4">
              {filteredSchemes.map((scheme, index) => (
                <motion.div
                  key={scheme.id}
                  className="border rounded-xl p-4 hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{scheme.name}</h3>
                        <StatusBadge status={scheme.status} />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="block">Contractor</span>
                          <span className="font-medium text-foreground">{scheme.contractor}</span>
                        </div>
                        <div>
                          <span className="block">District</span>
                          <span className="font-medium text-foreground">{scheme.district}</span>
                        </div>
                        <div>
                          <span className="block">Beneficiaries</span>
                          <span className="font-medium text-foreground">{scheme.beneficiaries.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="block">Last Update</span>
                          <span className="font-medium text-foreground flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {scheme.lastUpdate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                      {/* Fund Progress */}
                      <div className="text-right min-w-32">
                        <div className="text-sm text-muted-foreground mb-1">Fund Release</div>
                        <div className="font-semibold">
                          ₹{(scheme.fundReleased / 100000).toFixed(1)}L / ₹{(scheme.fundAllocated / 100000).toFixed(1)}L
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-civic-green h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(scheme.fundReleased / scheme.fundAllocated) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Complaints */}
                      {scheme.complaints > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {scheme.complaints} complaints
                        </Badge>
                      )}

                      {/* Actions */}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredSchemes.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No schemes found matching your criteria</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </Layout>
  );
};
