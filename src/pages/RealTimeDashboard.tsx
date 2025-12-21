import { Layout } from "@/components/layout/Layout";
import { RealTimeAnalyticsDashboard } from "@/components/common/RealTimeAnalyticsDashboard";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/common/GlassCard";
import { Activity, TrendingUp } from "lucide-react";

export const RealTimeDashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-civic-blue/10 rounded-lg">
              <Activity className="w-6 h-6 text-civic-blue" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Real-Time Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Live metrics and performance monitoring
              </p>
            </div>
          </div>
        </motion.div>

        {/* Real-Time Analytics Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <RealTimeAnalyticsDashboard />
        </motion.div>

        {/* Additional Real-Time Features */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-civic-green" />
              <h3 className="text-lg font-semibold">Live Updates</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Metrics are updated in real-time with live data streaming from the ICP blockchain.
              All transactions and policy executions are tracked instantly.
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-civic-blue" />
              <h3 className="text-lg font-semibold">Performance Monitoring</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Monitor system performance, transaction throughput, and canister health metrics
              across all deployed smart contracts.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </Layout>
  );
};
