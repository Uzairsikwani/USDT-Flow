
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Wallet, DollarSign, TrendingUp, Activity, Bell, Shield, ArrowUpRight, ArrowDownLeft, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PortfolioCard from "../components/dashboard/PortfolioCard";
import RateDisplay from "../components/dashboard/RateDisplay";
import LivePriceChart from "../components/dashboard/LivePriceChart";
import PriceAlertModal from "../components/notifications/PriceAlertModal";
import LiveChatWidget from "../components/support/LiveChatWidget";

export default function Dashboard() {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [currentRate, setCurrentRate] = useState(88.45);
  const [kycStatus, setKycStatus] = useState(null);
  const [loadingKyc, setLoadingKyc] = useState(true);

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 10),
    initialData: [],
  });

  useEffect(() => {
    loadKYCStatus();
    // Simulate live rate updates
    const updateRate = () => {
      setCurrentRate(prev => {
        const change = (Math.random() - 0.5) * 0.3;
        return Math.max(87.5, Math.min(89.5, prev + change));
      });
    };
    
    const interval = setInterval(updateRate, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadKYCStatus = async () => {
    try {
      const user = await base44.auth.me();
      const kycRecords = await base44.entities.KYCVerification.filter({ created_by: user.email });
      if (kycRecords.length > 0) {
        setKycStatus(kycRecords[0]);
      }
    } catch (error) {
      console.error('Error loading KYC:', error);
    }
    setLoadingKyc(false);
  };

  // Calculate stats with new fee structure
  const stats = React.useMemo(() => {
    const totalInvested = transactions
      .filter(t => t.type === 'buy')
      .reduce((sum, t) => sum + (t.amount_inr || 0), 0);
    
    const totalBalance = transactions.reduce((sum, t) => {
      return sum + (t.type === 'buy' ? (t.amount_usdt || 0) : -(t.amount_usdt || 0));
    }, 0);

    const avgRate = currentRate;

    return {
      totalBalance: Math.max(0, totalBalance),
      totalInvested,
      totalTransactions: transactions.length,
      avgRate
    };
  }, [transactions, currentRate]);

  const handleSaveAlert = async (alertData) => {
    try {
      await base44.entities.PriceAlert.create(alertData);
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back! 👋</h1>
            <p className="text-slate-600">Here's your USDT exchange overview</p>
          </div>
          <Button
            onClick={() => setShowAlertModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-200"
          >
            <Bell className="w-4 h-4 mr-2" />
            Price Alert
          </Button>
        </div>

        {/* KYC Warning */}
        {!loadingKyc && (!kycStatus || kycStatus.status !== 'approved') && (
          <Alert className="mb-6 bg-amber-50 border-amber-300">
            <Shield className="w-5 h-5 text-amber-600" />
            <AlertDescription className="text-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold mb-1">KYC Verification Required</p>
                  <p className="text-sm">Complete your KYC verification to start buying and selling USDT</p>
                </div>
                <Link to={createPageUrl("Kyc")}>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Verify Now
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* KYC Success */}
        {kycStatus?.status === 'approved' && (
          <Alert className="mb-6 bg-green-50 border-green-300">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <AlertDescription className="text-green-700 font-medium">
              ✅ Your KYC is verified! You have full access to all features.
            </AlertDescription>
          </Alert>
        )}

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <PortfolioCard
            title="USDT Balance"
            value={`${stats.totalBalance.toFixed(2)} USDT`}
            change="+12.5%"
            icon={Wallet}
            trend="up"
          />
          <PortfolioCard
            title="Total Invested"
            value={`₹${stats.totalInvested.toLocaleString()}`}
            change="+8.2%"
            icon={DollarSign}
            trend="up"
          />
          <PortfolioCard
            title="Current Rate"
            value={`₹${stats.avgRate.toFixed(2)}`}
            change="-0.5%"
            icon={TrendingUp}
            trend="down"
          />
          <PortfolioCard
            title="Transactions"
            value={stats.totalTransactions.toString()}
            icon={Activity}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <LivePriceChart />
            <RateDisplay />
            
            {/* Recent Transactions */}
            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                            transaction.type === 'buy' 
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' 
                              : 'bg-gradient-to-br from-red-400 to-pink-500 text-white'
                          }`}>
                            {transaction.type === 'buy' ? 
                              <ArrowUpRight className="w-6 h-6" /> : 
                              <ArrowDownLeft className="w-6 h-6" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 capitalize">
                              {transaction.type} USDT
                            </p>
                            <p className="text-sm text-slate-600 capitalize">
                              {transaction.exchange || 'Platform'} • {transaction.status}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900">
                            {transaction.amount_usdt} USDT
                          </p>
                          <p className="text-sm text-slate-600">
                            ₹{transaction.amount_inr?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-slate-600 font-medium mb-2">No transactions yet</p>
                    <p className="text-sm text-slate-500 mb-4">Start your USDT journey today!</p>
                    <div className="flex gap-3 justify-center">
                      <Link to={createPageUrl("Buy")}>
                        <Button className="bg-green-600 hover:bg-green-700">
                          Buy USDT
                        </Button>
                      </Link>
                      <Link to={createPageUrl("Sell")}>
                        <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                          Sell USDT
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Link to={createPageUrl("Buy")} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 h-16 group shadow-lg">
                    <div className="text-center">
                      <ArrowUpRight className="w-6 h-6 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-bold">Buy USDT</span>
                    </div>
                  </Button>
                </Link>
                <Link to={createPageUrl("Sell")} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 h-16 group shadow-lg">
                    <div className="text-center">
                      <ArrowDownLeft className="w-6 h-6 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-bold">Sell USDT</span>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* KYC Status Card */}
            {!loadingKyc && (
              <Card className={`shadow-xl ${
                kycStatus?.status === 'approved' 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300'
                  : 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300'
              }`}>
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center gap-2 font-bold">
                    <Shield className={`w-5 h-5 ${kycStatus?.status === 'approved' ? 'text-green-600' : 'text-amber-600'}`} />
                    KYC Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {kycStatus?.status === 'approved' ? (
                    <div className="space-y-2">
                      <Badge className="bg-green-100 text-green-700 border-green-300 mb-2">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                      <p className="text-sm text-slate-700 font-medium">
                        ✓ Full access enabled<br/>
                        ✓ Unlimited transactions<br/>
                        ✓ Priority support
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                        {kycStatus?.status === 'under_review' ? 'Under Review' : 'Not Verified'}
                      </Badge>
                      <p className="text-sm text-slate-700 mb-3">
                        {kycStatus?.status === 'under_review' 
                          ? 'Your documents are being reviewed. This usually takes 24-48 hours.'
                          : 'Complete KYC to unlock all features'}
                      </p>
                      {kycStatus?.status !== 'under_review' && (
                        <Link to={createPageUrl("Kyc")}>
                          <Button className="w-full bg-amber-600 hover:bg-amber-700">
                            Complete KYC
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Market Info */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 font-bold">Market Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="text-slate-700 font-medium">24h Volume</span>
                    <span className="text-slate-900 font-bold">₹2.4B</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="text-slate-700 font-medium">Market Cap</span>
                    <span className="text-slate-900 font-bold">$95.8B</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="text-slate-700 font-medium">Exchanges</span>
                    <span className="text-slate-900 font-bold">4 Connected</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="text-slate-700 font-medium">Network Fee</span>
                    <span className="text-slate-900 font-bold">₹25</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PriceAlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        onSave={handleSaveAlert}
      />

      <LiveChatWidget />
    </div>
  );
}
