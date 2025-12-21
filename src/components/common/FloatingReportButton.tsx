
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { Flag } from 'lucide-react';

export const FloatingReportButton: React.FC = () => {
  const [notificationCount] = useState(3);
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="fixed bottom-6 left-6 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', damping: 25, stiffness: 300 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/report')}
              className="relative w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Flag className="w-6 h-6" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs flex items-center justify-center"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Report Issues</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
