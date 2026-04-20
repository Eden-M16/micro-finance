"use client";

import { useWeb3 } from "@/lib/Web3Context";
import { useEffect, useState } from "react";
import { 
  Activity, 
  ShieldCheck, 
  Trophy, 
  Info, 
  Zap, 
  TrendingUp, 
  ArrowUpRight,
  Wallet,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CreditScore() {
  const { address, contract, connect } = useWeb3();
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (contract && address) {
      contract.users(address).then((profile: any) => {
        setScore(Number(profile.creditScore));
      });
    }
  }, [contract, address]);

  const getScoreLevel = () => {
    if (score >= 800) return { label: "Excellent", color: "var(--brand-600)", stroke: "var(--brand-600)", bg: "var(--brand-50)" };
    if (score >= 600) return { label: "Good", color: "var(--ethiopia-blue)", stroke: "var(--ethiopia-blue)", bg: "#eff6ff" };
    if (score >= 400) return { label: "Fair", color: "var(--ethiopia-yellow)", stroke: "var(--ethiopia-yellow)", bg: "#fefce8" };
    return { label: "Poor", color: "var(--ethiopia-red)", stroke: "var(--ethiopia-red)", bg: "#fef2f2" };
  };

  const level = getScoreLevel();

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
            backgroundColor: '#fefce8', 
            color: '#ca8a04', 
            borderRadius: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 2rem' 
          }}>
            <Star size={48} />
          </div>
          <h2 className="page-title" style={{ fontSize: '2.5rem' }}>Check Reputation</h2>
          <p className="page-subtitle" style={{ marginBottom: '2.5rem' }}>Connect your wallet to see your on-chain credit score and reputation history.</p>
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
      <div className="text-center" style={{ maxWidth: '48rem', margin: '0 auto 5rem' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-title"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '1.5rem' }}
        >
          Credit Reputation
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="page-subtitle"
          style={{ fontSize: '1.25rem', lineHeight: 1.6 }}
        >
          Your score is a measure of your reliability on the EthioLend protocol. Build trust to unlock better rates and higher limits.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Score Gauge */}
        <div style={{ gridColumn: 'span 5' }}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="gauge-container">
                <svg className="gauge-svg">
                  <circle
                    cx="144"
                    cy="144"
                    r="130"
                    className="gauge-bg"
                  />
                  <motion.circle
                    cx="144"
                    cy="144"
                    r="130"
                    className="gauge-fill"
                    stroke={level.stroke}
                    strokeDasharray={2 * Math.PI * 130}
                    initial={{ strokeDashoffset: 2 * Math.PI * 130 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 130 * (1 - score / 1000) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </svg>
                <div className="gauge-text">
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--text-gray-900)' }}
                  >
                    {score}
                  </motion.span>
                  <span style={{ 
                    marginTop: '1rem', 
                    padding: '0.5rem 1.5rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.875rem', 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em', 
                    backgroundColor: level.bg, 
                    color: level.color 
                  }}>
                    {level.label}
                  </span>
                </div>
              </div>

              <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%' }}>
                {[
                  { icon: ShieldCheck, label: "Status", val: "Verified", color: "var(--brand-600)" },
                  { icon: Trophy, label: "Ranking", val: "Top 12%", color: "var(--ethiopia-yellow)" },
                  { icon: Activity, label: "Impact", val: "High", color: "var(--ethiopia-blue)" }
                ].map((stat, i) => (
                  <div key={i} style={{ backgroundColor: 'var(--bg-gray-50)', padding: '1rem', borderRadius: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border-gray-100)' }}>
                    <stat.icon size={20} style={{ margin: '0 auto', color: stat.color }} />
                    <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--text-gray-900)' }}>{stat.val}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info & History */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Card style={{ backgroundColor: 'var(--text-gray-900)', color: 'white', border: 'none', overflow: 'hidden', position: 'relative' }}>
            <CardHeader style={{ padding: '2.5rem', paddingBottom: '1.5rem' }}>
              <CardTitle style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
                <Zap style={{ color: 'var(--ethiopia-yellow)' }} />
                Improve Your Reputation
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: '2.5rem', paddingTop: 0 }}>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                {[
                  { title: "Repay on time", desc: "Every loan repaid before the due date boosts your score by +50 points.", icon: "✓" },
                  { title: "Supply ETH", desc: "Lenders earn reputation points for providing pool liquidity.", icon: "✓" },
                  { title: "Consistent Activity", desc: "Regular usage of the protocol builds a stable long-term score.", icon: "✓" },
                  { title: "Avoid Over-leveraging", desc: "Keep your total borrowed amount within reasonable limits.", icon: "✓" }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h4 style={{ fontWeight: 900, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ backgroundColor: '#2563eb', color: 'white', width: '1.25rem', height: '1.25rem', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{item.icon}</span>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-gray-900)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TrendingUp style={{ color: '#2563eb' }} />
              Recent Score Changes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { type: "Repayment", change: "+50", date: "2 days ago", score: "850" },
                { type: "Repayment", change: "+50", date: "1 month ago", score: "800" },
                { type: "Initial Score", change: "+500", date: "3 months ago", score: "500" }
              ].map((log, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', backgroundColor: 'white', borderRadius: '1.5rem', border: '1px solid var(--border-gray-100)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div className="flex" style={{ alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '3rem', height: '3rem', backgroundColor: 'var(--brand-50)', color: 'var(--brand-600)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowUpRight size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 900, color: 'var(--text-gray-900)' }}>{log.type}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-gray-400)', fontWeight: 700 }}>{log.date}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--brand-600)' }}>{log.change}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-gray-400)' }}>Total: {log.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
