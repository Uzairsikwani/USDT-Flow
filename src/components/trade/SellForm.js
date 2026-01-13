import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, AlertCircle } from "lucide-react";
import FeeBreakdown from './FeeBreakdown';

export default function SellForm({ onSubmit, isProcessing, currentRate, walletBalance }) {
  const [formData, setFormData] = useState({
    amount_usdt: '',
    amount_inr: '',
    bank_account: '',
    exchange: 'platform_wallet' // Default to platform wallet for sells
  });
  const [balanceError, setBalanceError] = useState("");

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    
    if (field === 'amount_usdt' && value) {
      newData.amount_inr = (parseFloat(value) * currentRate).toFixed(2);
      
      const requestedAmount = parseFloat(value) || 0;
      if (requestedAmount > walletBalance) {
        setBalanceError(`Insufficient balance! You have ${walletBalance.toFixed(6)} USDT available.`);
      } else {
        setBalanceError("");
      }
    } else if (field === 'amount_inr' && value) {
      newData.amount_usdt = (parseFloat(value) / currentRate).toFixed(6);
      
      const requestedAmount = parseFloat(newData.amount_usdt) || 0;
      if (requestedAmount > walletBalance) {
        setBalanceError(`Insufficient balance! You have ${walletBalance.toFixed(6)} USDT available.`);
      } else {
        setBalanceError("");
      }
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
    
    const requestedAmount = parseFloat(formData.amount_usdt) || 0;
    if (requestedAmount > walletBalance) {
      setBalanceError(`Insufficient balance! You have ${walletBalance.toFixed(6)} USDT available.`);
      return;
    }
    
    const fees = calculateFees();
    const netAmount = parseFloat(formData.amount_inr) - fees.totalFee;
    
    onSubmit({ 
      ...formData, 
      rate: currentRate,
      platform_fee: fees.platformFee,
      network_fee: fees.networkFee,
      total_fee: fees.totalFee,
      net_amount: netAmount,
      exchange_wallet: 'platform_wallet' // For sell, it's from platform wallet
    });
  };

  return (
    <Card className="bg-white border-slate-200 shadow-xl">
      <CardHeader>
        <CardTitle className="text-slate-900 font-bold flex items-center justify-between">
          <span>Sell USDT</span>
          <div className="text-sm font-medium text-slate-600">
            Balance: <span className="text-blue-600">{walletBalance.toFixed(6)} USDT</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {balanceError && (
          <Alert className="bg-red-50 border-red-300 text-red-800 mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              {balanceError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount_usdt" className="text-slate-700 font-medium">
                Amount to Sell (USDT)
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
            
            <div className="space-y-2">
              <Label htmlFor="amount_inr" className="text-slate-700 font-medium">
                You'll Receive (INR)
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
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Receive INR To</Label>
            <Select 
              value={formData.bank_account} 
              onValueChange={(value) => handleInputChange('bank_account', value)}
              required
            >
              <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                <SelectValue placeholder="Select bank account for payout" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300">
                <SelectItem value="hdfc_123">HDFC Bank - ***123</SelectItem>
                <SelectItem value="sbi_456">SBI - ***456</SelectItem>
                <SelectItem value="icici_789">ICICI Bank - ***789</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">INR will be transferred to this account instantly</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span className="text-slate-700 font-medium">Current Rate</span>
              </div>
              <span className="text-slate-900 font-bold text-lg">₹{currentRate.toFixed(2)}/USDT</span>
            </div>
          </div>

          {formData.amount_inr && (
            <FeeBreakdown 
              amount={parseFloat(formData.amount_inr)} 
              type="sell"
              showDetails={true}
            />
          )}

          <Button
            type="submit"
            disabled={
              isProcessing || 
              !formData.amount_usdt || 
              !formData.bank_account ||
              parseFloat(formData.amount_usdt) > walletBalance ||
              !!balanceError
            }
            className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold shadow-lg shadow-red-200 transition-all duration-200"
          >
            {isProcessing ? 'Processing...' : 'Sell USDT Now'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
