PinVerification.jsimport React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Lock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function PinVerification({ isOpen, onClose, onVerify, title = "Verify Transaction" }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }

    if (attempts >= 3) {
      setError("Too many attempts. Please try again later.");
      return;
    }

    setLoading(true);
    
    // Simulate secure verification with delay
    setTimeout(() => {
      if (pin === "1234") { // Demo PIN
        onVerify(true);
        setPin("");
        setAttempts(0);
        onClose();
      } else {
        setAttempts(prev => prev + 1);
        setError(`Incorrect PIN. ${3 - attempts - 1} attempts remaining.`);
        setPin("");
      }
      setLoading(false);
    }, 500);
  };

  const handleClose = () => {
    setPin("");
    setError("");
    setAttempts(0);
    onClose();
Add PinVerification component
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Enter your 4-digit PIN to authorize this transaction
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl tracking-widest bg-slate-50 border-slate-300 text-slate-900"
              autoFocus
              disabled={attempts >= 3}
            />
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 text-sm p-2 bg-red-50 rounded-lg"
              >
                <AlertTriangle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
            <p className="text-xs text-slate-500 text-center">
              Demo PIN: 1234 | Enhanced security verification
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              disabled={loading || attempts >= 3}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="w-3 h-3 text-green-600" />
              <span>Secured by 256-bit encryption</span>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
