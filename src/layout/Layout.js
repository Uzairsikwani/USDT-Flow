
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  History, 
  Settings,
  Wallet,
  TrendingUp,
  Shield,
  DollarSign,
  Newspaper,
  User,
  LogOut,
  Award,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Buy USDT",
    url: createPageUrl("Buy"),
    icon: ArrowUpRight, // Changed icon
  },
  {
    title: "Sell USDT",
    url: createPageUrl("Sell"),
    icon: ArrowDownLeft, // Changed icon
  },
  {
    title: "Wallets & Accounts",
    url: createPageUrl("Wallets"),
    icon: Wallet,
  },
  {
    title: "KYC Verification",
    url: createPageUrl("Kyc"), // Changed to "Kyc" (lowercase 'c')
    icon: Shield,
  },
  {
    title: "Crypto News",
    url: createPageUrl("News"),
    icon: Newspaper,
  },
  {
    title: "History",
    url: createPageUrl("History"),
    icon: History,
  },
  {
    title: "Achievements",
    url: createPageUrl("Achievements"),
    icon: Award,
  },
  {
    title: "Earnings",
    url: createPageUrl("AdminEarnings"),
    icon: DollarSign,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary: 220 90% 56%;
          --primary-foreground: 0 0% 100%;
          --background: 240 20% 99%;
          --foreground: 240 10% 15%;
          --card: 0 0% 100%;
          --card-foreground: 240 10% 15%;
          --popover: 0 0% 100%;
          --popover-foreground: 240 10% 15%;
          --secondary: 240 5% 96%;
          --secondary-foreground: 240 6% 10%;
          --muted: 240 5% 96%;
          --muted-foreground: 240 4% 46%;
          --accent: 240 5% 96%;
          --accent-foreground: 240 6% 10%;
          --destructive: 0 84% 60%;
          --destructive-foreground: 0 0% 100%;
          --border: 240 6% 90%;
          --input: 240 6% 90%;
          --ring: 220 90% 56%;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.5); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-xl shadow-xl">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <TrendingUp className="w-7 h-7 text-white animate-float" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">USDT Flow</h2>
                <p className="text-xs text-slate-600 font-medium">Buy • Sell • Convert</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300 rounded-xl mb-2 group ${
                          location.pathname === item.url ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white shadow-xl shadow-blue-300 scale-105' : 'text-slate-700'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <div className="px-4 py-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-md">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Shield className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-bold">Protected</span>
                </div>
                <div className="text-xs text-slate-700 font-medium">
                  🔐 2FA Active<br/>
                  ✅ KYC Verified<br/>
                  🛡️ Bank-Grade Security
                </div>
              </div>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-4 bg-gradient-to-r from-blue-50 to-purple-50">
            <button 
              onClick={() => setShowAccountDialog(true)}
              className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-bold text-slate-800 text-sm truncate">{user?.full_name || 'Premium User'}</p>
                <p className="text-xs text-purple-600 truncate font-semibold">⭐ VIP Member</p>
              </div>
            </button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 md:hidden shadow-lg">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 p-2 rounded-lg transition-all duration-200 text-slate-700" />
              <Link to={createPageUrl("Dashboard")}>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer">USDT Flow</h1>
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Account Dialog */}
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent className="bg-white border-slate-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900 font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Account Information
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-lg">{user?.full_name || 'Premium User'}</p>
                <p className="text-sm text-slate-600">{user?.email || 'user@example.com'}</p>
                <p className="text-xs text-purple-600 font-semibold mt-1">⭐ VIP Member • {user?.role || 'User'}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link to={createPageUrl("Settings")}>
                <button className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left">
                  <Settings className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="font-medium text-slate-900">Account Settings</p>
                    <p className="text-xs text-slate-600">Manage your preferences</p>
                  </div>
                </button>
              </Link>

              <Link to={createPageUrl("Achievements")}>
                <button className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-slate-900">Achievements</p>
                    <p className="text-xs text-slate-600">View your badges</p>
                  </div>
                </button>
              </Link>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left"
              >
                <LogOut className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Logout</p>
                  <p className="text-xs text-red-600">Sign out of your account</p>
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
