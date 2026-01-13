EarningsWidget.jsimport React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function EarningsWidget() {
  const [earnings, setEarnings] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    totalTransactions: 0,
    totalVolume: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const transactions = await base44.entities.Transaction.list('-created_date');
      
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const weekStart = new Date(now.setDate(now.getDate() - 7));
      const monthStart = new Date(now.setDate(1));

      let todayEarnings = 0;
      let weekEarnings = 0;
      let monthEarnings = 0;
      let totalVolume = 0;

      const dailyData = {};

      transactions.forEach(tx => {
        const txDate = new Date(tx.created_date);
        const dateKey = txDate.toLocaleDateString();
        
        const fee = tx.total_fee || ((tx.amount_inr * 0.015) + 25);
        totalVolume += tx.amount_inr;

        if (!dailyData[dateKey]) {
          dailyData[dateKey] = { date: dateKey, earnings: 0, volume: 0 };
        }
        dailyData[dateKey].earnings += fee;
        dailyData[dateKey].volume += tx.amount_inr;

        if (txDate >= todayStart) todayEarnings += fee;
        if (txDate >= weekStart) weekEarnings += fee;
        if (txDate >= monthStart) monthEarnings += fee;
      });

      setEarnings({
        today: todayEarnings,
        thisWeek: weekEarnings,
        thisMonth: monthEarnings,
        totalTransactions: transactions.length,
        totalVolume
      });

      const chartArray = Object.values(dailyData).slice(-7);
      setChartData(chartArray);
    } catch (error) {
      console.error('Error loading earnings:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-700">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">₹{earnings.today.toFixed(2)}</p>
                <Badge className="mt-1 bg-green-100 text-green-700 border-green-300">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-700">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">₹{earnings.thisWeek.toFixed(2)}</p>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-700">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">₹{earnings.thisMonth.toFixed(2)}</p>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-700">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">₹{(earnings.totalVolume / 1000).toFixed(1)}K</p>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900">7-Day Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#1e293b'
                }}
                formatter={(value) => [`₹${value.toFixed(2)}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#22c55e"
Add EarningsWidget component                fill="url(#colorEarnings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fee Breakdown */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900">Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-700">Platform Fees (1.5%)</span>
            <span className="text-slate-900 font-medium">₹{(earnings.thisMonth * 0.857).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-700">Network Fees</span>
            <span className="text-slate-900 font-medium">₹{(earnings.thisMonth * 0.143).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
            <span className="text-slate-900 font-semibold">Total Revenue</span>
            <span className="text-green-600 font-semibold text-lg">₹{earnings.thisMonth.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
