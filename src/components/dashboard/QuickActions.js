import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Wallet, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickActions() {
  return (
    <Card className="bg-white border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Link to={createPageUrl("Buy")}>
          <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 h-12 group shadow-md shadow-green-200">
            <ArrowUpRight className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Buy USDT
          </Button>
        </Link>
        <Link to={createPageUrl("Sell")}>
          <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 h-12 group shadow-md shadow-red-200">
            <ArrowDownLeft className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Sell USDT
          </Button>
        </Link>
        <Link to={createPageUrl("Settings")}>
          <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 h-12">
            <Wallet className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </Link>
        <Link to={createPageUrl("History")}>
          <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 h-12">
            <Settings className="w-4 h-4 mr-2" />
            History
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
