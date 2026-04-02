
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnhancedNotificationSystem } from "@/components/common/EnhancedNotificationSystem";
import { AuthModal } from "@/components/common/AuthModal";
import { EnhancedReportModal } from "@/components/common/EnhancedReportModal";
import { 
  Users, 
  FileText, 
  Gavel, 
  Menu, 
  X,
  LogIn,
  AlertTriangle,
  Shield
} from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userRoles = [
    { name: "Policy Maker", icon: FileText, path: "/policy-maker", color: "civic-green" },
    { name: "Citizen", icon: Users, path: "/citizen", color: "civic-blue" },
    { name: "Auditor", icon: Shield, path: "/auditor", color: "civic-gold" },
    { name: "Contractor", icon: Gavel, path: "/contractor", color: "accent" }
  ];

  return (
         <motion.header 
       className="fixed top-0 left-0 right-0 w-full z-[9999] backdrop-blur-xl bg-civic-white/98 border-b border-civic-gray-100/60 shadow-glass gpu-accelerated"
       initial={{ y: -100, opacity: 0 }}
       animate={{ y: 0, opacity: 1 }}
       transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100, damping: 20 }}
       style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
     >
             <div className="container mx-auto px-4 h-16 flex items-center justify-between flex-nowrap min-w-0 max-w-7xl overflow-hidden relative z-10" style={{ position: 'relative', zIndex: 10, gap: '0.5rem' }}>
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-elevation group-hover:shadow-glow transition-all duration-300 overflow-hidden bg-gradient-civic"
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src="/civic-logo.png"
              alt="CivicLedger Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>
          <div className="flex flex-col">
            <motion.span 
              className="text-xl font-bold text-foreground group-hover:text-civic-blue transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              CivicLedger
            </motion.span>
            <span className="text-xs text-civic-slate opacity-80">Transparent Governance</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-4 flex-nowrap min-w-0 relative z-10" style={{ position: 'relative', zIndex: 10 }}>
          <Link to="/dashboard" className="nav-item text-sm font-semibold text-civic-slate hover:text-civic-blue transition-all duration-300 py-2 whitespace-nowrap">
            Live Dashboard
          </Link>
          <Link to="/voting" className="nav-item text-sm font-semibold text-civic-slate hover:text-civic-blue transition-all duration-300 py-2 whitespace-nowrap">
            DAO Voting
          </Link>

          {/* Role Selection - Compact */}
          <div className="flex items-center space-x-2">
            {userRoles.map((role, index) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link to={role.path}>
                                     <Button 
                     variant="ghost" 
                     size="sm" 
                     className="h-8 px-2 text-civic-slate hover:text-civic-blue hover:bg-civic-blue/8 transition-all duration-300 font-semibold hover-lift border border-transparent hover:border-civic-blue/20 text-xs"
                   >
                     <role.icon className="w-3 h-3 mr-1" />
                     <span className="whitespace-nowrap">{role.name}</span>
                   </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Submit Report */}
                    <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="relative group z-10"
          >
            <EnhancedReportModal 
              trigger={
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2 border-civic-orange/40 bg-civic-orange/8 text-civic-orange hover:bg-civic-orange hover:text-white transition-all duration-300 shadow-glass hover:shadow-warning font-semibold hover-lift text-xs"
                  title="Report an Issue"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  <span className="whitespace-nowrap">Report</span>
                </Button>
              }
            />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
              Report Issue
            </div>
          </motion.div>

          {/* Enhanced Notification System */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <EnhancedNotificationSystem />
          </motion.div>
        </nav>

        {/* Internet Identity Button - Isolated */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="relative group z-[99999] ml-4"
          style={{ 
            position: 'relative', 
            zIndex: 99999,
            isolation: 'isolate',
            transform: 'translateZ(0)',
            pointerEvents: 'auto'
          }}
        >
          <AuthModal
            trigger={
              <Button 
                variant="default" 
                size="sm" 
                className="h-8 px-4 font-bold text-xs !bg-blue-600 !text-white hover:!bg-blue-700 border-2 border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 !relative !z-[99999] min-w-[140px] !pointer-events-auto"
                title="Internet Identity Login"
                style={{ 
                  position: 'relative', 
                  zIndex: 99999,
                  backgroundColor: '#2563eb !important',
                  color: 'white !important',
                  isolation: 'isolate',
                  transform: 'translateZ(0)',
                  pointerEvents: 'auto',
                  display: 'block !important',
                  opacity: '1 !important'
                }}
              >
                <LogIn className="w-3 h-3 mr-1" />
                <span className="whitespace-nowrap">Internet Identity</span>
              </Button>
            }
          />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-[99999]">
            Internet Identity
          </div>
        </motion.div>

        {/* Medium Screen Navigation */}
        <nav className="hidden lg:flex xl:hidden items-center space-x-4 flex-nowrap min-w-0">
          <Link to="/dashboard" className="nav-item text-sm font-semibold text-civic-slate hover:text-civic-blue transition-all duration-300 py-2 whitespace-nowrap">
            Dashboard
          </Link>
          <Link to="/voting" className="nav-item text-sm font-semibold text-civic-slate hover:text-civic-blue transition-all duration-300 py-2 whitespace-nowrap">
            DAO Voting
          </Link>
          
          {/* Compact Role Selection */}
          <div className="flex items-center space-x-2">
            {userRoles.slice(0, 2).map((role, index) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link to={role.path}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-civic-slate hover:text-civic-blue hover:bg-civic-blue/8 transition-all duration-300 font-semibold hover-lift border border-transparent hover:border-civic-blue/20 text-xs"
                  >
                    <role.icon className="w-3 h-3 mr-1" />
                    <span className="whitespace-nowrap">{role.name}</span>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <EnhancedReportModal 
            trigger={
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2 border-civic-orange/40 bg-civic-orange/8 text-civic-orange hover:bg-civic-orange hover:text-white transition-all duration-300 shadow-glass hover:shadow-warning font-semibold hover-lift text-xs"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                <span className="whitespace-nowrap">Report</span>
              </Button>
            }
          />

          <AuthModal
            trigger={
              <Button 
                variant="default" 
                size="sm" 
                className="h-8 px-4 font-bold text-xs !bg-blue-600 !text-white hover:!bg-blue-700 border-2 border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[140px]"
                style={{ 
                  backgroundColor: '#2563eb !important',
                  color: 'white !important',
                  isolation: 'isolate'
                }}
              >
                <LogIn className="w-3 h-3 mr-1" />
                <span className="whitespace-nowrap">Internet Identity</span>
              </Button>
            }
          />
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden w-9 h-9 p-0"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="lg:hidden bg-civic-white/98 backdrop-blur-md border-t border-civic-gray-100 shadow-elevation"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 py-6 space-y-4">
            <div className="space-y-3">
              <Link 
                to="/dashboard" 
                className="flex items-center py-3 text-civic-slate hover:text-civic-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="w-5 h-5 mr-3" />
                Live Dashboard
              </Link>
              <Link 
                to="/voting" 
                className="flex items-center py-3 text-civic-slate hover:text-civic-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Gavel className="w-5 h-5 mr-3" />
                DAO Voting
              </Link>
            </div>
            
            <div className="pt-4 border-t border-civic-gray-100">
              <p className="text-sm font-medium text-civic-slate mb-3">Access Portal:</p>
              <div className="grid grid-cols-1 gap-2">
                {userRoles.map((role) => (
                  <Link key={role.name} to={role.path} onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start h-12 border-civic-gray-200 hover:border-civic-blue hover:bg-civic-blue/5">
                      <role.icon className="w-5 h-5 mr-3" />
                      {role.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-civic-gray-100 space-y-3">
              <EnhancedReportModal 
                trigger={
                  <Button variant="outline" className="w-full h-12 border-civic-orange/30 bg-civic-orange/5 text-civic-orange hover:bg-civic-orange hover:text-white">
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    Report Issue
                  </Button>
                }
              />
              
              <AuthModal
                trigger={
                  <Button 
                    className="w-full h-12 !bg-blue-600 !text-white hover:!bg-blue-700 border-2 border-blue-800 shadow-lg font-bold"
                    style={{ 
                      backgroundColor: '#2563eb !important',
                      color: 'white !important'
                    }}
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    Internet Identity
                  </Button>
                }
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};
