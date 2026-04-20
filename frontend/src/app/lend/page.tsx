"use client";

import { useWeb3 } from "@/lib/Web3Context";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { 
  Landmark, 
  ArrowUpRight, 
  Wallet, 
  Info, 
  HandHeart, 
  TrendingUp, 
  ShieldCheck,
  Calculator,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function Lend() {
  const { address, contract, connect } = useWeb3();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [userDeposit, setUserDeposit] = useState("0");
  const [poolLiquidity, setPoolLiquidity] = useState("0");

  useEffect(() => {
    if (contract && address) {
      fetchData();
    }
  }, [contract, address]);

  const fetchData = async () => {
    if (!contract || !address) return;
    try {
      const [dep, liquidity] = await Promise.all([
        contract.deposits(address),
        contract.totalPoolLiquidity()
      ]);
      setUserDeposit(ethers.formatEther(dep));
      setPoolLiquidity(ethers.formatEther(liquidity));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !amount) return;

    setLoading(true);
    try {
      const tx = await contract.deposit({
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      setAmount("");
      fetchData();
      alert("Deposit successful!");
    } catch (error) {
      console.error("Deposit failed:", error);
      alert("Transaction failed. Check console for details.");
    }
    setLoading(false);
  };

  const potentialYield = amount ? (parseFloat(amount) * 0.05).toFixed(4) : "0.0000";
  const potentialLoans = amount ? Math.floor(parseFloat(amount) / 0.05) : 0;

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
          <h2 className="page-title" style={{ fontSize: '2.5rem' }}>Start Lending</h2>
          <p className="page-subtitle" style={{ marginBottom: '2.5rem' }}>Connect your wallet to provide liquidity and support the community while earning rewards.</p>
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
          Lend & Empower
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="page-subtitle"
          style={{ fontSize: '1.25rem', lineHeight: 1.6 }}
        >
          Provide liquidity to the microfinance pool and help Ethiopian entrepreneurs grow. Your ETH directly funds community-backed micro-loans.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Deposit Form */}
        <div style={{ gridColumn: 'span 1' }}>
          <Card style={{ position: 'sticky', top: '8rem', overflow: 'visible' }}>
            <div style={{ 
              position: 'absolute', 
              top: '-1.5rem', 
              left: '2rem', 
              backgroundColor: 'var(--brand-600)', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '1rem', 
              boxShadow: '0 20px 25px -5px rgba(22, 163, 74, 0.2)',
              transform: 'rotate(-4deg)'
            }}>
              <Landmark size={28} />
            </div>
            <CardHeader style={{ paddingTop: '3rem', paddingBottom: '1.5rem' }}>
              <CardTitle style={{ fontSize: '1.875rem', fontWeight: 900 }}>Supply Liquidity</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <form onSubmit={handleDeposit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Input
                    label="Amount to Deposit (ETH)"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.1"
                    required
                  />
                </div>

                <div style={{ backgroundColor: 'var(--bg-gray-50)', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid var(--border-gray-100)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calculator size={16} style={{ color: 'var(--text-gray-400)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-gray-400)', textTransform: 'uppercase' }}>Earning Estimate</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-gray-500)', fontWeight: 500 }}>Est. Yearly Yield</span>
                    <span style={{ fontWeight: 700, color: 'var(--brand-600)' }}>{potentialYield} ETH</span>
                  </div>
                  <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 900, color: 'var(--text-gray-900)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Community Impact</span>
                    <span style={{ fontWeight: 900, color: 'var(--text-gray-900)' }}>{potentialLoans} Loans</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  size="lg"
                  style={{ backgroundColor: 'var(--brand-600)' }}
                >
                  Deposit Now
                  <ArrowUpRight size={24} style={{ marginLeft: '8px' }} />
                </Button>
              </form>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '1rem', border: '1px solid #dbeafe' }}>
                <Info size={20} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.75rem', color: '#1e40af', lineHeight: 1.6 }}>
                  Your funds are secured by smart contracts. You can withdraw at any time as long as the pool has sufficient liquidity.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info & Stats */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <Card style={{ backgroundColor: 'white' }}>
              <CardContent style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--brand-50)', color: 'var(--brand-600)', borderRadius: '1rem' }}>
                    <HandHeart size={24} />
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-gray-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>Your Contribution</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '3.75rem', fontWeight: 900, color: 'var(--text-gray-900)' }}>{userDeposit}</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-gray-400)' }}>ETH</span>
                </div>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: 'white' }}>
              <CardContent style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '1rem' }}>
                    <TrendingUp size={24} />
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-gray-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>Pool Liquidity</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '3.75rem', fontWeight: 900, color: 'var(--text-gray-900)' }}>{poolLiquidity}</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-gray-400)' }}>ETH</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--text-gray-900)' }}>Lender Perks</h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  title: "Earn Reputation",
                  desc: "Building a history of lending increases your own credit score and platform influence.",
                  icon: <ShieldCheck style={{ color: 'var(--brand-600)' }} />
                },
                {
                  title: "Social Impact",
                  desc: "Your capital directly empowers Ethiopian micro-businesses that lack traditional banking access.",
                  icon: <Users style={{ color: '#2563eb' }} />
                },
                {
                  title: "Full Control",
                  desc: "Withdraw your funds anytime. All transactions are transparent and verifiable on-chain.",
                  icon: <Wallet style={{ color: 'var(--ethiopia-yellow)' }} />
                },
                {
                  title: "Compound Growth",
                  desc: "Interest from loans is distributed back to the pool, increasing your potential returns.",
                  icon: <TrendingUp style={{ color: 'var(--ethiopia-red)' }} />
                }
              ].map((perk, idx) => (
                <Card key={idx} style={{ backgroundColor: 'rgba(249, 250, 251, 0.3)', border: '1px solid var(--border-gray-100)' }}>
                  <CardContent style={{ padding: '2rem', display: 'flex', gap: '1.5rem' }}>
                    <div style={{ width: '3rem', height: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {perk.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-gray-900)', marginBottom: '0.5rem' }}>{perk.title}</h4>
                      <p style={{ color: 'var(--text-gray-500)', fontSize: '0.875rem', lineHeight: 1.6 }}>{perk.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
