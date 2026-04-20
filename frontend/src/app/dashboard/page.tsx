"use client";

import { useWeb3 } from "@/lib/Web3Context";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { 
  TrendingUp, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  History, 
  CreditCard,
  User,
  Activity,
  Zap,
  Info,
  ChevronRight,
  Wallet,
  Clock,
  ArrowRightLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Dashboard() {
  const { address, contract, connect, loading } = useWeb3();
  const [userData, setUserData] = useState<any>(null);
  const [poolLiquidity, setPoolLiquidity] = useState("0");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (contract && address) {
      fetchDashboardData();
    }
  }, [contract, address]);

  const fetchDashboardData = async () => {
    if (!contract || !address) return;
    setFetching(true);
    try {
      const profile = await contract.users(address);
      const liquidity = await contract.totalPoolLiquidity();
      
      setUserData({
        creditScore: Number(profile.creditScore),
        totalBorrowed: ethers.formatEther(profile.totalBorrowed),
        totalLent: ethers.formatEther(profile.totalLent),
        isRegistered: profile.isRegistered
      });
      setPoolLiquidity(ethers.formatEther(liquidity));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setFetching(false);
  };

  const getCreditScoreBg = (score: number) => {
    if (score >= 800) return "bg-green-600";
    if (score >= 500) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
          style={{ padding: '3rem', textAlign: 'center', maxWidth: '32rem' }}
        >
          <div style={{ 
            width: '6rem', 
            height: '6rem', 
            backgroundColor: 'var(--brand-50)', 
            color: 'var(--brand-600)', 
            borderRadius: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 2rem' 
          }}>
            <Wallet size={48} />
          </div>
          <h2 className="page-title" style={{ fontSize: '2rem' }}>Connect to Finance</h2>
          <p className="page-subtitle" style={{ marginBottom: '2.5rem' }}>Join the decentralized community. Connect your wallet to access your dashboard and start building your on-chain reputation.</p>
          <Button
            onClick={connect}
            size="lg"
            style={{ width: '100%' }}
          >
            Connect MetaMask
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
      >
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">Financial overview for <span style={{ fontFamily: 'monospace', color: 'var(--brand-600)' }}>{address.substring(0, 6)}...{address.substring(address.length - 4)}</span></p>
        </div>
        <div className="status-badge">
          <div className="status-dot"></div>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-gray-700)' }}>Sepolia Active</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stat-grid">
        {[
          { 
            label: "Credit Score", 
            value: userData?.creditScore || "0", 
            max: "/ 1000", 
            icon: Activity, 
            color: "blue",
            progress: (userData?.creditScore || 0) / 10
          },
          { 
            label: "Total Lent", 
            value: userData?.totalLent || "0.00", 
            unit: "ETH", 
            icon: ArrowUpCircle, 
            color: "green" 
          },
          { 
            label: "Total Borrowed", 
            value: userData?.totalBorrowed || "0.00", 
            unit: "ETH", 
            icon: ArrowDownCircle, 
            color: "red" 
          },
          { 
            label: "Pool Liquidity", 
            value: poolLiquidity, 
            unit: "ETH", 
            icon: TrendingUp, 
            color: "yellow" 
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card style={{ height: '100%' }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-gray-400)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</span>
                  <div style={{ 
                    padding: '0.75rem', 
                    backgroundColor: `var(--brand-50)`, 
                    color: `var(--brand-600)`, 
                    borderRadius: '1rem' 
                  }}>
                    <stat.icon size={24} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-gray-900)' }}>{stat.value}</span>
                  {stat.unit && <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-gray-400)' }}>{stat.unit}</span>}
                  {stat.max && <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-gray-400)' }}>{stat.max}</span>}
                </div>
                {stat.progress !== undefined && (
                  <div className="progress-bar-bg">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      className={`progress-bar-fill ${getCreditScoreBg(userData?.creditScore || 0)}`}
                    ></motion.div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Area */}
        <div style={{ gridColumn: 'span 2' }}>
          {/* Quick Actions */}
          <Card style={{ 
            background: 'linear-gradient(to bottom right, #111827, #1f2937)', 
            border: 'none', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
          }}>
            <CardContent style={{ padding: '2.5rem' }}>
              <div className="flex" style={{ flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
                <div style={{ maxWidth: '28rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>Empower Your Future</h3>
                  <p style={{ color: 'var(--text-gray-400)', fontSize: '1.125rem' }}>
                    Whether you want to earn yields on your ETH or need a community-backed micro-loan, EthioLend is here for you.
                  </p>
                </div>
                <div className="flex" style={{ gap: '1rem' }}>
                  <Link href="/lend">
                    <Button variant="secondary" size="lg" style={{ backgroundColor: 'var(--brand-600)', color: 'white' }}>
                      Supply ETH
                    </Button>
                  </Link>
                  <Link href="/borrow">
                    <Button variant="outline" size="lg" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                      Request Loan
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card style={{ marginTop: '2rem' }}>
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-gray-100)', paddingBottom: '1.5rem' }}>
              <CardTitle style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <History style={{ color: 'var(--brand-600)' }} />
                Recent Activity
              </CardTitle>
              <Link href="/history" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--brand-600)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View All <ChevronRight size={16} />
              </Link>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', color: 'var(--text-gray-400)' }}>
                <div style={{ width: '5rem', height: '5rem', backgroundColor: 'var(--bg-gray-50)', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '1.5rem' }}>
                   <style jsx>{`
                    .center-icon { margin: auto; }
                  `}</style>
                  <ArrowRightLeft size={32} style={{ opacity: 0.2, margin: 'auto' }} />
                </div>
                <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>No recent transactions found on-chain.</p>
                <p style={{ fontSize: '0.875rem' }}>Transactions will appear here after they are confirmed.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar/Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Card style={{ backgroundColor: 'var(--brand-600)', color: 'white', border: 'none', position: 'relative', overflow: 'hidden' }}>
            <CardContent style={{ padding: '2rem', position: 'relative', zIndex: 10 }}>
              <div style={{ width: '3rem', height: '3rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Loan Eligibility</h3>
              <p style={{ color: 'var(--brand-50)', marginBottom: '2rem', opacity: 0.9, lineHeight: 1.6 }}>
                Based on your credit score of <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{userData?.creditScore}</span>, you can instantly borrow:
              </p>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 900 }}>{(userData?.creditScore * 0.001).toFixed(3)}</span>
                <span style={{ marginLeft: '0.5rem', fontWeight: 700, opacity: 0.6 }}>ETH</span>
              </div>
              <Link href="/borrow">
                <Button style={{ width: '100%', padding: '1rem', backgroundColor: 'white', color: 'var(--brand-700)', fontSize: '1.125rem' }}>
                  Apply Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'var(--ethiopia-yellow)', color: 'var(--text-gray-900)', border: 'none' }}>
            <CardContent style={{ padding: '2rem' }}>
              <div className="flex" style={{ alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '3rem', height: '3rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Info size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Pro Tip</h3>
              </div>
              <p style={{ fontWeight: 500, lineHeight: 1.6, fontStyle: 'italic' }}>
                "Repay your micro-loans early to boost your credit score faster. High scores unlock the best community interest rates!"
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} style={{ color: 'var(--ethiopia-blue)' }} />
                Next Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-gray-50)', borderRadius: '1rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-gray-400)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>No active loans</p>
                <p style={{ color: 'var(--text-gray-900)', fontWeight: 900, fontSize: '1.25rem' }}>0.00 ETH Due</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
