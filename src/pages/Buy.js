
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Clock, Sparkles, Shield, Lock, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BuyForm from "../components/trade/BuyForm";
import QuickAmountSelector from "../components/trade/QuickAmountSelector";
import PinVerification from "../components/security/PinVerification";
import BiometricPrompt from "../components/security/BiometricPrompt";
// Assuming react-router-dom for Link
// From shadcn/ui

// Helper function to create page URLs based on common conventions
const createPageUrl = (pageName) => {
  // Simple implementation: convert to lowercase and prepend '/'
  // In a real application, this would likely be more sophisticated,
  // potentially using a route configuration object or a dedicated routing utility.
  return `/${pageName.toLowerCase()}`;
};

export default function Buy() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [pendingTrade, setPendingTrade] = useState(null);
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentRate, setCurrentRate] = useState(88.45);
  const [kycStatus, setKycStatus] = useState(null);
  const [loadingKyc, setLoadingKyc] = useState(true);

  useEffect(() => {
    checkKYCStatus();
    fetchLiveRate(); // Initial fetch
    const interval = setInterval(fetchLiveRate, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const checkKYCStatus = async () => {
    try {
      const user = await base44.auth.me();
      // Assuming KYCVerification entity has a 'created_by' field that stores the user's email
      const kycRecords = await base44.entities.KYCVerification.filter({ created_by: user.email });
      if (kycRecords.length > 0) {
        setKycStatus(kycRecords[0]); // Take the first KYC record if multiple exist
      } else {
        setKycStatus(null); // No KYC record found
      }
    } catch (error) {
      console.error('Error checking KYC:', error);
      // Handle error, e.g., user not logged in or API issue
      setKycStatus(null); // Assume no KYC if there's an error fetching
    }
    setLoadingKyc(false);
  };

  const fetchLiveRate = () => {
    setCurrentRate(prev => {
      const change = (Math.random() - 0.5) * 0.3; // Random change between -0.15 and +0.15
      return Math.max(87.5, Math.min(89.5, prev + change)); // Keep rate between 87.5 and 89.5
    });
  };

  const handleBuy = async (buyData) => {
    // Check KYC before proceeding
    if (!kycStatus || kycStatus.status !== 'approved') {
      setResult({
        type: 'error',
        message: 'KYC verification required! Please complete your KYC to buy USDT.'
      });
      return;
    }

    setPendingTrade(buyData);
    
    // Randomly decide between biometric and PIN verification
    if (Math.random() > 0.5) {
      setShowBiometric(true);
    } else {
      setShowPinVerification(true);
    }
  };

  const handleSecurityVerified = async (verified) => {
    // Close verification prompts
    setShowPinVerification(false);
    setShowBiometric(false);

    if (!verified || !pendingTrade) {
        // If not verified or no pending trade, just exit
        setPendingTrade(null); // Clear pending trade if verification failed or canceled
        if (!verified) {
            setResult({
                type: 'error',
                message: 'Security verification failed or cancelled.'
            });
        }
        return;
    }

    setIsProcessing(true);
    setResult(null); // Clear previous results

    try {
      const transaction = await base44.entities.Transaction.create({
        ...pendingTrade,
        type: 'buy',
        status: 'completed'
      });

      // Simulate a small delay for processing
      setTimeout(() => {
        setResult({
          type: 'success',
          message: `USDT Purchase completed successfully! 🎉 Transaction ID: ${transaction.id.slice(0, 8).toUpperCase()}`,
          transaction
        });
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setSelectedQuickAmount(null); // Reset quick amount selection after successful purchase
        }, 3000); // Confetti and quick amount reset duration
        setIsProcessing(false);
      }, 800); // Simulate API response time

    } catch (error) {
      console.error('Transaction error:', error);
      setResult({
        type: 'error',
        message: 'Purchase failed. Please try again or contact support.'
      });
      setIsProcessing(false);
    }
    
    setPendingTrade(null); // Clear the pending trade after attempt
  };

  const handleQuickAmountSelect = (amount) => {
    setSelectedQuickAmount(amount);
  };

  // --- KYC Blocking UI ---
  if (loadingKyc) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Checking verification status...</p>
        </div>
      </div>
    );
  }

  if (!kycStatus || kycStatus.status !== 'approved') {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-xl">
            <CardContent className="p-8 text-center">
              <Shield className="w-20 h-20 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">KYC Verification Required</h2>
              <p className="text-slate-700 mb-6">
                {kycStatus?.status === 'under_review' 
                  ? 'Your KYC documents are under review. This usually takes 24-48 hours. You will be able to trade once approved.'
                  : kycStatus?.status === 'rejected'
                  ? 'Your KYC was rejected. Please complete verification via the Dashboard.'
                  : 'You need to complete KYC verification before you can buy USDT. Please visit the Dashboard to begin verification.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  // --- End KYC Blocking UI ---

  return (
    <div className="p-4 md:p-8 space-y-8 relative">
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 360,
                  opacity: 0
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: "linear"
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 flex items-center gap-2"
          >
            <ArrowUpRight className="w-10 h-10 text-green-600" />
            Buy USDT
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </motion.h1>
          <p className="text-slate-600 font-medium">Purchase USDT instantly with INR at live market rates</p>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className={`mb-6 ${
              result.type === 'success' 
                ? 'bg-green-50 border-green-300 text-green-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}>
              {result.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <AlertDescription className="font-medium">
                {result.message}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QuickAmountSelector 
              onSelect={handleQuickAmountSelect}
              selectedAmount={selectedQuickAmount}
            />
            <BuyForm 
              onSubmit={handleBuy} 
              isProcessing={isProcessing}
              quickAmount={selectedQuickAmount}
              currentRate={currentRate}
            />
          </div>

          <div className="space-y-6">
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-green-600 animate-pulse" />
                      <div>
                        <p className="font-bold text-slate-900">Processing Purchase</p>
                        <p className="text-sm text-slate-600">Almost done...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <Card className="bg-white border-slate-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 font-bold">Purchase Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Processing Time</span>
                    <span className="font-medium text-green-600">⚡ Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Service Fee</span>
                    <span className="font-medium text-slate-900">1.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Network Fee</span>
                    <span className="font-medium text-slate-900">₹25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Default Network</span>
                    <span className="font-medium text-slate-900">TRC20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Min Amount</span>
                    <span className="font-medium text-slate-900">₹100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Daily Limit</span>
                    <span className="font-medium text-slate-900">₹1,00,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Advanced Security
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-700 space-y-2 font-medium">
                <p>🔒 256-bit encryption</p>
                <p>🔐 Multi-factor authentication</p>
                <p>🛡️ Real-time fraud detection</p>
                <p>📱 Device fingerprinting</p>
                <p>🔍 Transaction monitoring</p>
                <p>💳 PCI DSS compliant</p>
                <p>⚡ Instant notifications</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Your Safety Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2">
                <p>✓ Every transaction verified</p>
                <p>✓ Secure wallet integration</p>
                <p>✓ Insurance protected</p>
                <p>✓ 24/7 security monitoring</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PinVerification
        isOpen={showPinVerification}
        onClose={() => setShowPinVerification(false)}
        onVerify={handleSecurityVerified}
      />

      <BiometricPrompt
        isOpen={showBiometric}
        onClose={() => setShowBiometric(false)}
        onVerify={handleSecurityVerified}
      />
    </div>
  );
}
