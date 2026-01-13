import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const presetAmounts = [500, 1000, 2500, 5000, 10000, 25000];

export default function QuickAmountSelector({ onSelect, selectedAmount }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400">Quick Select (INR)</p>
      <div className="grid grid-cols-3 gap-2">
        {presetAmounts.map((amount) => (
          <motion.div
            key={amount}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelect(amount)}
              className={`w-full ${
                selectedAmount === amount
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ₹{amount.toLocaleString()}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
