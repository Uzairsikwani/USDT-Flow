BiometricPrompt.jsimport React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fingerprint, Scan, Shield, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BiometricPrompt({ isOpen, onClose, onVerify }) {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleBiometric = () => {
    setVerifying(true);
    
    // Simulate biometric authentication with enhanced security
    setTimeout(() => {
      setVerified(true);
      setTimeout(() => {
        onVerify(true);
        onClose();
        setVerifying(false);
        setVerified(false);
      }, 800);
    }, 1200);
  };

Add BiometricPrompt component    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900 flex items-center gap-2">
            <Scan className="w-5 h-5 text-green-600" />
            Biometric Authentication
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!verified ? (
                <motion.div
                  key="fingerprint"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ scale: verifying ? [1, 1.1, 1] : 1 }}
                    transition={{ repeat: verifying ? Infinity : 0, duration: 1.5 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Fingerprint className="w-16 h-16 text-white" />
                  </motion.div>
                  {verifying && (
                    <motion.div
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-green-500 rounded-full"
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <CheckCircle className="w-16 h-16 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="text-center">
            <p className="text-slate-900 font-medium mb-2">
              {verifying ? "Verifying..." : verified ? "Verified!" : "Touch Sensor to Authenticate"}
            </p>
            <p className="text-sm text-slate-600">
              {verified ? "Transaction approved" : "Secure biometric verification"}
            </p>
          </div>

          {!verifying && !verified && (
            <Button
              onClick={handleBiometric}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-12 font-medium"
            >
              <Fingerprint className="w-5 h-5 mr-2" />
              Authenticate Now
            </Button>
          )}

          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="w-3 h-3 text-green-600" />
              <span>Biometric data never leaves your device</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
