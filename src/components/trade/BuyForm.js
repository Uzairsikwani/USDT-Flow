BuyForm.js  import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";
import FeeBreakdown from './FeeBreakdown';

export default function BuyForm({ onSubmit, isProcessing, quickAmount, currentRate }) {
  const [formData, setFormData] = useState({
    amount_inr: '',
    amount_usdt: '',
    exchange: '',
    bank_account: '',
    exchange_wallet: ''
  });

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
    
    if (field === 'amount_inr' && value) {
      newData.amount_usdt = (parseFloat(value) / currentRate).toFixed(6);
    } else if (field === 'amount_usdt' && value) {
      newData.amount_inr = (parseFloat(value) * currentRate).toFixed(2);
    }
    
    setFormData(newData);
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
    const fees = calculateFees();
    const netAmount = parseFloat(formData.amount_inr) + fees.totalFee;
    
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
        <CardTitle className="text-slate-900 font-bold">
          Purchase USDT
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                You'll Receive (USDT)
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

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Exchange Platform</Label>
            <Select 
              value={formData.exchange} 
              onValueChange={(value) => handleInputChange('exchange', value)}
              required
            >
              <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                <SelectValue placeholder="Where should we send your USDT?" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300">
                <SelectItem value="binance">Binance</SelectItem>
                <SelectItem value="bybit">Bybit</SelectItem>
                <SelectItem value="coinbase">Coinbase</SelectItem>
                <SelectItem value="kraken">Kraken</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Your Bank Account</Label>
            <Select 
              value={formData.bank_account} 
              onValueChange={(value) => handleInputChange('bank_account', value)}
              required
            >
              <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                <SelectValue placeholder="Select bank account for payment" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300">
                <SelectItem value="hdfc_123">HDFC Bank - ***123</SelectItem>
                <SelectItem value="sbi_456">SBI - ***456</SelectItem>
                <SelectItem value="icici_789">ICICI Bank - ***789</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Your Exchange Wallet Address</Label>
            <Input
              placeholder="Enter your USDT wallet address on the exchange"
              value={formData.exchange_wallet}
              onChange={(e) => handleInputChange('exchange_wallet', e.target.value)}
              className="bg-white border-slate-300 text-slate-900"
              required
            />
            <p className="text-xs text-slate-500">We'll send USDT to this address after payment confirmation</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span className="text-slate-700 font-medium">Current Rate</span>
Add BuyForm component              <span className="text-slate-900 font-bold text-lg">₹{currentRate.toFixed(2)}/USDT</span>
            </div>
          </div>

          {formData.amount_inr && (
            <FeeBreakdown 
              amount={parseFloat(formData.amount_inr)} 
              type="buy"
              showDetails={true}
            />
          )}

          <Button
            type="submit"
            disabled={
              isProcessing || 
              !formData.amount_inr || 
              !formData.exchange || 
              !formData.bank_account || 
              !formData.exchange_wallet
            }
            className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-lg shadow-green-200 transition-all duration-200"
          >
            {isProcessing ? 'Processing...' : 'Buy USDT Now'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
