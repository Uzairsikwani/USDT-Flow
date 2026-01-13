FeeBreakdown.js  import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, TrendingDown, Zap, Shield } from "lucide-react";

export default function FeeBreakdown({ amount, type, showDetails = false }) {
  const platformFeeRate = 0.015;
  const networkFeeFlat = 25;
  
  const platformFee = amount ? (amount * platformFeeRate).toFixed(2) : 0;
  const networkFee = amount > 0 ? networkFeeFlat : 0;
  const totalFee = (parseFloat(platformFee) + parseFloat(networkFee)).toFixed(2);
  const netAmount = type === 'buy' 
    ? (amount + parseFloat(totalFee)).toFixed(2)
    : (amount - parseFloat(totalFee)).toFixed(2);

  return (
    <div className="space-y-4">
      {showDetails && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              Fee Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <TrendingDown className="w-3 h-3 text-green-600" />
              <span>Competitive 1.5% service fee</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>Flat ₹25 network processing</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Shield className="w-3 h-3 text-blue-600" />
              <span>100% transparent - No hidden charges</span>
            </div>
          </CardContent>
        </Card>
      )}
Add FeeBreakdown component      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-900">
            {type === 'buy' ? 'Total Payment' : 'You Will Receive'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>{type === 'buy' ? 'Purchase Amount' : 'Sale Amount'}</span>
            <span className="font-medium">₹{amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Service Fee (1.5%)</span>
            <span className="font-medium">₹{platformFee}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Network Fee</span>
            <span className="font-medium">₹{networkFee}</span>
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-between">
            <span className="font-bold text-slate-900">
              {type === 'buy' ? 'Total to Pay' : 'Net Amount'}
            </span>
            <span className="font-bold text-lg text-slate-900">₹{netAmount}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
