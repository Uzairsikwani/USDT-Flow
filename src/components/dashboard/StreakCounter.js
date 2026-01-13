StreakCounter.jsimport React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function StreakCounter({ streak = 3, totalTrades = 15 }) {
  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-900 flex items-center gap-2 text-lg">
          <Flame className="w-5 h-5 text-orange-500" />
Add StreakCounter component        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <motion.p 
              key={streak}
              initial={{ scale: 1.5, color: '#f97316' }}
              animate={{ scale: 1, color: '#0f172a' }}
              className="text-4xl font-bold text-slate-900"
            >
              {streak} Days
            </motion.p>
            <p className="text-sm text-slate-600 font-medium">Keep it going! 🔥</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-purple-600 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-sm font-bold">{totalTrades} Exchanges</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-semibold">Super Active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
