AchievementBadge.jsimport React from 'react';
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, Zap, Target, Shield } from "lucide-react";
import { motion } from "framer-motion";

const achievementIcons = {
  Trophy,
  Star,
  Award,
  Zap,
  Target,
  Shield
};

export default function AchievementBadge({ achievement, isNew }) {
  const Icon = achievementIcons[achievement.badge_icon] || Trophy;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
Add AchievementBadge component        achievement.unlocked 
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
          : 'bg-slate-700/30 border border-slate-600'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            achievement.unlocked
              ? 'bg-yellow-500/20'
              : 'bg-slate-600/50'
          }`}>
            <Icon className={`w-6 h-6 ${
              achievement.unlocked ? 'text-yellow-400' : 'text-slate-400'
            }`} />
          </div>
          <div className="flex-1">
            <p className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
              {achievement.title}
            </p>
            <p className="text-xs text-slate-400">{achievement.description}</p>
          </div>
          {isNew && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              New!
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
