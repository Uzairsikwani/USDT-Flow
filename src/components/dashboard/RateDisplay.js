import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RateDisplay() {
  const [rates, setRates] = useState({
    usdt_inr: 88.45,
    last_updated: new Date(),
    trend: 'up',
    change_percent: 0.45
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshRates();
    const interval = setInterval(refreshRates, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const refreshRates = () => {
    setLoading(true);
    
    // Simulate realistic USDT/INR rate fluctuation
    setRates(prev => {
      const change = (Math.random() - 0.5) * 0.3; // Small realistic changes
      const newRate = Math.max(87.5, Math.min(89.5, prev.usdt_inr + change));
      const changePercent = ((newRate - prev.usdt_inr) / prev.usdt_inr * 100).toFixed(2);
      
      return {
        usdt_inr: parseFloat(newRate.toFixed(2)),
        last_updated: new Date(),
        trend: change > 0 ? 'up' : 'down',
        change_percent: Math.abs(changePercent)
      };
    });
    
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-slate-900 flex items-center gap-2 font-bold">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Live USDT Rate
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshRates}
          disabled={loading}
          className="text-slate-600 hover:text-slate-900 hover:bg-green-100"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">1 USDT =</p>
              <p className="text-3xl font-bold text-slate-900">₹{rates.usdt_inr.toFixed(2)}</p>
            </div>
            <Badge 
              variant={rates.trend === 'up' ? 'default' : 'destructive'}
              className={rates.trend === 'up' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}
            >
              {rates.trend === 'up' ? '↑' : '↓'} {rates.change_percent}%
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Last updated: {rates.last_updated.toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
