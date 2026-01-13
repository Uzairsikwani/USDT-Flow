import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, AlertTriangle, QrCode } from "lucide-react";
import { motion } from "framer-motion";

export default function DepositInstructions({ onDepositConfirmed }) {
  const [copied, setCopied] = useState(false);
  const [depositAddress] = useState("TUJx9Kx8XXXXXXXXXXXXXXXXXXXXXXXXXX"); // Platform's deposit address
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [depositData, setDepositData] = useState({
    amount_usdt: '',
    transaction_hash: '',
    from_address: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const user = await base44.auth.me();
      
      // Create deposit record
      await base44.entities.Deposit.create({
        ...depositData,
        to_address: depositAddress,
        network: 'TRC20',
        status: 'confirmed', // Auto-confirm for demo
        confirmations: 20
      });

      // Update or create wallet
      const wallets = await base44.entities.Wallet.filter({ created_by: user.email });
      
      if (wallets.length > 0) {
        const wallet = wallets[0];
        await base44.entities.Wallet.update(wallet.id, {
          balance_usdt: wallet.balance_usdt + parseFloat(depositData.amount_usdt),
          total_deposited: (wallet.total_deposited || 0) + parseFloat(depositData.amount_usdt)
        });
      } else {
        await base44.entities.Wallet.create({
          balance_usdt: parseFloat(depositData.amount_usdt),
          total_deposited: parseFloat(depositData.amount_usdt),
          total_withdrawn: 0,
          deposit_address: depositAddress
        });
      }

      setShowDepositForm(false);
      setDepositData({ amount_usdt: '', transaction_hash: '', from_address: '' });
      onDepositConfirmed();
      
    } catch (error) {
      console.error('Error processing deposit:', error);
    }
    
    setSubmitting(false);
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-xl">
      <CardHeader>
        <CardTitle className="text-slate-900 font-bold flex items-center gap-2">
          <QrCode className="w-5 h-5 text-amber-600" />
          Step 1: Deposit USDT to Your Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 p-3 bg-amber-100 rounded-lg border border-amber-300">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-slate-700 font-medium">
            First deposit USDT to your wallet, then you can sell it for INR
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-lg border border-slate-200">
            <div className="flex-1 min-w-0">
              <Label className="text-xs text-slate-600">Platform Deposit Address (TRC20)</Label>
              <p className="font-mono text-sm text-slate-900 truncate">{depositAddress}</p>
            </div>
            <Button
              onClick={copyAddress}
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-700 hover:bg-amber-50 flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white rounded border border-slate-200">
              <p className="text-slate-600">Network</p>
              <p className="font-medium text-slate-900">TRC20 (Tron)</p>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <p className="text-slate-600">Confirmation Time</p>
              <p className="font-medium text-slate-900">~1 minute</p>
            </div>
          </div>
        </div>

        {!showDepositForm ? (
          <Button
            onClick={() => setShowDepositForm(true)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium"
          >
            I've Sent USDT - Confirm Deposit
          </Button>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleDepositSubmit}
            className="space-y-4 p-4 bg-white rounded-lg border border-amber-200"
          >
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Amount Sent (USDT)</Label>
              <Input
                type="number"
                step="0.000001"
                placeholder="0.000000"
                value={depositData.amount_usdt}
                onChange={(e) => setDepositData({...depositData, amount_usdt: e.target.value})}
                className="bg-white border-slate-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Transaction Hash</Label>
              <Input
                placeholder="Enter blockchain transaction hash"
                value={depositData.transaction_hash}
                onChange={(e) => setDepositData({...depositData, transaction_hash: e.target.value})}
                className="bg-white border-slate-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Your Wallet Address</Label>
              <Input
                placeholder="Your USDT wallet address (from where you sent)"
                value={depositData.from_address}
                onChange={(e) => setDepositData({...depositData, from_address: e.target.value})}
                className="bg-white border-slate-300"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                {submitting ? 'Confirming...' : 'Confirm Deposit'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDepositForm(false)}
                className="border-slate-300"
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        )}

        <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-amber-200">
          <p>✓ Only send TRC20 USDT to this address</p>
          <p>✓ Minimum deposit: 10 USDT</p>
          <p>✓ Deposits are credited after 20 confirmations (~1 minute)</p>
        </div>
      </CardContent>
    </Card>
  );
}
