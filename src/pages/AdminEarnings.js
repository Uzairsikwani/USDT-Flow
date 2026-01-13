src/pages/AdminEarnings.jsimport React from "react";
import EarningsWidget from "../components/admin/EarningsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Shield, Info } from "lucide-react";

export default function AdminEarnings() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-green-400" />
            Platform Earnings
          </h1>
          <p className="text-slate-400">Monitor your revenue and transaction metrics</p>
        </div>

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-blue-500/20 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="space-y-2">
                <p className="text-white font-medium">Fee Structure</p>
                <div className="text-sm text-slate-300 space-y-1">
                  <p>• Service Fee: 1.5% on all transactions</p>
                  <p>• Network Fee: ₹25 flat fee per transaction</p>
                  <p>• VIP Tier: 1% for transactions above ₹50,000</p>
                  <p>• Transparent pricing - No hidden charges</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Dashboard */}
        <EarningsWidget />

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Competitive Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Our 1.5% service fee is competitive while ensuring quality service for USDT buyers and sellers.
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Transparent Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              All fees are clearly displayed before transaction. Users know exactly what they're paying.
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-400" />
                Volume Incentives
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              VIP rates encourage high-volume exchanges, increasing both user satisfaction and platform revenue.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
