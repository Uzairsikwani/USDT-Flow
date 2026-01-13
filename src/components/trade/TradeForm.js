import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, Calculator, AlertCircle } from "lucide-react";
import FeeBreakdown from './FeeBreakdown';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TradeForm({ onSubmit, isProcessing, quickAmount, currentRate }) {
  const [activeTab, setActiveTab] = useState("buy");
  const [formData, setFormData] = useState({
    type: 'buy',
    amount_inr: '',
    amount_usdt: '',
    exchange: '',
    bank_account: '',
    exchange_wallet: ''
  });
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [balanceError, setBalanceError] = useState("");

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const transactions = await base44.entities.Transaction.list();
      const balance = transactions.reduce((sum, tx) => {
        return sum + (tx.type === 'buy' ? tx.amount_usdt : -tx.amount_usdt);
      }, 0);
      setUsdtBalance(Math.max(0, balance));
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  // Update amount when quick select is used
  useEffect(() => {
    if (quickAmount) {
      setFormData(prev => ({
        ...prev,
        amount_inr: quickAmount.toString(),
        amount_usdt: (parseFloat(quickAmount) / currentRate).toFixed(6)
      }));
    }
  }, [quickAmount, currentRate]);

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    
    // Auto-calculate conversions
    if (field === 'amount_inr' && value) {
      newData.amount_usdt = (parseFloat(value) / currentRate).toFixed(6);
    } else if (field === 'amount_usdt' && value) {
      newData.amount_inr = (parseFloat(value) * currentRate).toFixed(2);
    }
    
    // Check balance for sell transactions
    if (activeTab === 'sell' && field === 'amount_usdt') {
      const requestedAmount = parseFloat(value) || 0;
      if (requestedAmount > usdtBalance) {
        setBalanceError(`Insufficient balance! You have ${usdtBalance.toFixed(6)} USDT available.`);
      } else {
        setBalanceError("");
      }
    }
    
    setFormData(newData);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ ...formData, type: tab, amount_inr: '', amount_usdt: '' });
    setBalanceError("");
  };

  const calculateFees = () => {
    const amount = parseFloat(formData.amount_inr) || 0;
    const platformFee = amount * 0.015;
    const networkFee = amount > 0 ? 25 : 0;
    const totalFee = platformFee + networkFee;
    
    return { platformFee, networkFee, totalFee };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate sell amount against balance
    if (activeTab === 'sell') {
      const requestedAmount = parseFloat(formData.amount_usdt) || 0;
      if (requestedAmount > usdtBalance) {
        setBalanceError(`Insufficient balance! You have ${usdtBalance.toFixed(6)} USDT available.`);
        return;
      }
    }
    
    const fees = calculateFees();
    const netAmount = activeTab === 'buy' 
      ? parseFloat(formData.amount_inr) + fees.totalFee 
      : parseFloat(formData.amount_inr) - fees.totalFee;
    
    onSubmit({ 
      ...formData, 
      rate: currentRate,
      platform_fee: fees.platformFee,
      network_fee: fees.networkFee,
      total_fee: fees.totalFee,
      net_amount: netAmount
    });
  };

  return (
    <Card className="bg-white border-slate-200 shadow-xl">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-blue-600" />
            Exchange USDT
          </div>
          {activeTab === 'sell' && (
            <div className="text-sm font-medium text-slate-600">
              Balance: <span className="text-blue-600">{usdtBalance.toFixed(6)} USDT</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100">
            <TabsTrigger 
              value="buy" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-medium"
            >
              Buy USDT
            </TabsTrigger>
            <TabsTrigger 
              value="sell"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white font-medium"
            >
              Sell USDT
            </TabsTrigger>
          </TabsList>

          {balanceError && (
            <Alert className="bg-red-50 border-red-300 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {balanceError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount_inr" className="text-slate-700 font-medium">
                  Amount (INR)
                </Label>
                <Input
                  id="amount_inr"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount_inr}
                  onChange={(e) => handleInputChange('amount_inr', e.target.value)}
                  className="bg-white border-slate-300 text-slate-900"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount_usdt" className="text-slate-700 font-medium">
                  Amount (USDT)
                </Label>
                <Input
                  id="amount_usdt"
                  type="number"
                  step="0.000001"
                  placeholder="0.000000"
                  value={formData.amount_usdt}
                  onChange={(e) => handleInputChange('amount_usdt', e.target.value)}
                  className="bg-white border-slate-300 text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Exchange Selection */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Exchange Platform</Label>
              <Select 
                value={formData.exchange} 
                onValueChange={(value) => handleInputChange('exchange', value)}
                required
              >
                <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                  <SelectValue placeholder="Select exchange" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-300">
                  <SelectItem value="binance">Binance</SelectItem>
                  <SelectItem value="bybit">Bybit</SelectItem>
                  <SelectItem value="coinbase">Coinbase</SelectItem>
                  <SelectItem value="kraken">Kraken</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="buy" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Your Bank Account</Label>
                <Select 
                  value={formData.bank_account} 
                  onValueChange={(value) => handleInputChange('bank_account', value)}
                  required
                >
                  <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-300">
                    <SelectItem value="hdfc_123">HDFC Bank - ***123</SelectItem>
                    <SelectItem value="sbi_456">SBI - ***456</SelectItem>
                    <SelectItem value="icici_789">ICICI Bank - ***789</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Exchange Wallet Address</Label>
                <Input
                  placeholder="Enter your exchange USDT wallet address"
                  value={formData.exchange_wallet}
                  onChange={(e) => handleInputChange('exchange_wallet', e.target.value)}
                  className="bg-white border-slate-300 text-slate-900"
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="sell" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Exchange Wallet (Source)</Label>
                <Input
                  placeholder="Your exchange USDT wallet address"
                  value={formData.exchange_wallet}
                  onChange={(e) => handleInputChange('exchange_wallet', e.target.value)}
                  className="bg-white border-slate-300 text-slate-900"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Receive INR To</Label>
                <Select 
                  value={formData.bank_account} 
                  onValueChange={(value) => handleInputChange('bank_account', value)}
                  required
                >
                  <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-300">
                    <SelectItem value="hdfc_123">HDFC Bank - ***123</SelectItem>
                    <SelectItem value="sbi_456">SBI - ***456</SelectItem>
                    <SelectItem value="icici_789">ICICI Bank - ***789</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Rate Display */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span className="text-slate-700 font-medium">Current Rate</span>
                </div>
                <span className="text-slate-900 font-bold text-lg">₹{currentRate.toFixed(2)}/USDT</span>
              </div>
            </div>

            {/* Fee Breakdown */}
            {formData.amount_inr && (
              <FeeBreakdown 
                amount={parseFloat(formData.amount_inr)} 
                type={activeTab}
                showDetails={true}
              />
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                isProcessing || 
                !formData.amount_inr || 
                !formData.exchange || 
                !formData.bank_account || 
                !formData.exchange_wallet ||
                (activeTab === 'sell' && parseFloat(formData.amount_usdt) > usdtBalance) ||
                !!balanceError
              }
              className={`w-full h-12 text-white font-bold shadow-lg transition-all duration-200 ${
                activeTab === 'buy'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-200'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-200'
              }`}
            >
              {isProcessing ? 'Processing...' : `${activeTab === 'buy' ? 'Buy' : 'Sell'} USDT Now`}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
