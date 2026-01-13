AchievementToast.jsimport React, { useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className="fixed bottom-6 right-6 z-[100] max-w-md"
      >
        <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 p-1 rounded-2xl shadow-2xl">
          <div className="bg-white rounded-xl p-6 relative overflow-hidden">
            {/* Animated background sparkles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: Math.random() * 2 
                  }}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>

            <Button
              variant="ghost"
Add AchievementToast component              onClick={onClose}
              className="absolute top-2 right-2 z-10"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="flex items-start gap-4 relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm font-bold text-yellow-600 uppercase tracking-wide">Achievement Unlocked!</p>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{achievement.title}</h3>
                <p className="text-sm text-slate-600">{achievement.description}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
