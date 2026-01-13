import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function PortfolioCard({ title, value, change, icon: Icon, trend }) {
  const isPositive = trend === 'up' || (typeof change === 'string' && change.startsWith('+'));
  
  return (
    <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {change && (
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
              {change}
            </span>
            <span>from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
