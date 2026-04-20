"use client";

import { useWeb3 } from "@/lib/Web3Context";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { 
  Banknote, 
  History, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Calculator,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function Borrow() {
  const { address, contract, connect } = useWeb3();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (contract && address) {
      fetchLoans();
      fetchUserData();
    }
  }, [contract, address]);

  const fetchUserData = async () => {
    if (!contract || !address) return;
    try {
      const profile = await contract.users(address);
      setUserData({
        creditScore: Number(profile.creditScore),
        isRegistered: profile.isRegistered
      });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLoans = async () => {
    if (!contract || !address) return;
    setFetching(true);
    try {
      const loanIds = await contract.getUserLoans(address);
      const loanPromises = loanIds.map((id: any) => contract.loans(id));
      const loanDetails = await Promise.all(loanPromises);
      
      const formattedLoans = loanDetails.map((loan: any) => ({
        id: loan.id.toString(),
        amount: ethers.formatEther(loan.amount),
        interest: ethers.formatEther(loan.interest),
        totalRepaid: ethers.formatEther(loan.totalRepaid),
        status: ["Requested", "Active", "Repaying", "Completed", "Defaulted"][Number(loan.status)],
        dueDate: new Date(Number(loan.dueDate) * 1000).toLocaleDateString()
      }));
      
      setActiveLoans(formattedLoans.filter(l => l.status !== "Completed"));
    } catch (e) {
      console.error(e);
    }
    setFetching(false);
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !amount) return;

    setLoading(true);
    try {
      const tx = await contract.requestLoan(ethers.parseEther(amount));
      await tx.wait();
      setAmount("");
      fetchLoans();
      alert("Loan request approved and funded!");
    } catch (error: any) {
      console.error("Borrow failed:", error);
      alert(error.reason || "Loan request failed. Ensure you have a high enough credit score and pool has liquidity.");
    }
    setLoading(false);
  };

  const handleRepay = async (loanId: string) => {
    if (!contract) return;
    const repayAmount = prompt("Enter repayment amount in ETH:");
    if (!repayAmount) return;

    setLoading(true);
    try {
      const tx = await contract.repayLoan(loanId, {
        value: ethers.parseEther(repayAmount)
      });
      await tx.wait();
      fetchLoans();
      alert("Repayment successful!");
    } catch (error) {
      console.error("Repayment failed:", error);
    }
    setLoading(false);
  };

  const interestAmount = amount ? (parseFloat(amount) * 0.05).toFixed(4) : "0.0000";
  const totalToRepay = amount ? (parseFloat(amount) * 1.05).toFixed(4) : "0.0000";
  const maxBorrow = userData ? (userData.creditScore * 0.001).toFixed(3) : "0.500";

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
            backgroundColor: '#dbeafe', 
            color: '#2563eb', 
            borderRadius: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 2rem' 
          }}>
            <Wallet size={48} />
          </div>
          <h2 className="page-title" style={{ fontSize: '2.5rem' }}>Start Borrowing</h2>
          <p className="page-subtitle" style={{ marginBottom: '2.5rem' }}>Connect your wallet to check your eligibility and request community-backed micro-loans instantly.</p>
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
      <div className="grid lg:grid-cols-3 gap-12">
        
        {/* Left Column: Form & Calculator */}
        <div style={{ gridColumn: 'span 1' }}>
          <Card style={{ position: 'sticky', top: '8rem', overflow: 'visible' }}>
            <div style={{ 
              position: 'absolute', 
              top: '-1.5rem', 
              left: '2rem', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '1rem', 
              boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.2)',
              transform: 'rotate(-4deg)'
            }}>
              <Banknote size={28} />
            </div>
            <CardHeader style={{ paddingTop: '3rem', paddingBottom: '1.5rem' }}>
              <CardTitle style={{ fontSize: '1.875rem', fontWeight: 900 }}>Request Loan</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <form onSubmit={handleRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Input
                    label="Amount (ETH)"
                    type="number"
                    step="0.001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.05"
                    required
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-gray-400)', textTransform: 'uppercase' }}>Available Limit</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 900, color: '#2563eb' }}>{maxBorrow} ETH</span>
                  </div>
                </div>

                {/* Calculator Display */}
                <div style={{ backgroundColor: 'var(--bg-gray-50)', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid var(--border-gray-100)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calculator size={16} style={{ color: 'var(--text-gray-400)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-gray-400)', textTransform: 'uppercase' }}>Loan Summary</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-gray-500)', fontWeight: 500 }}>Fixed Interest (5%)</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-gray-900)' }}>{interestAmount} ETH</span>
                  </div>
                  <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 900, color: 'var(--text-gray-900)' }}>Total Repayment</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#2563eb' }}>{totalToRepay} ETH</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  size="lg"
                  style={{ backgroundColor: '#2563eb' }}
                >
                  Request Loan
                </Button>
              </form>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', backgroundColor: '#fefce8', borderRadius: '1rem', border: '1px solid #fef9c3' }}>
                <AlertCircle size={20} style={{ color: '#ca8a04', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.75rem', color: '#854d0e', lineHeight: 1.6 }}>
                  Loans are auto-funded if pool liquidity is sufficient. Build your <span style={{ fontWeight: 700 }}>credit score</span> by repaying on time to unlock higher limits.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: History & Stats */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <Card style={{ backgroundColor: 'var(--brand-600)', color: 'white', border: 'none' }}>
              <CardContent style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <ShieldCheck size={24} style={{ color: 'rgba(255,255,255,0.6)' }} />
                  <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>On-Chain Reputation</span>
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>{userData?.creditScore || "500"}</div>
                <p style={{ opacity: 0.8 }}>Current Credit Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <TrendingUp size={24} style={{ color: '#2563eb' }} />
                  <span style={{ fontWeight: 700, color: 'var(--text-gray-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>History Overview</span>
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-gray-900)' }}>{activeLoans.length}</div>
                <p style={{ color: 'var(--text-gray-500)' }}>Active / Pending Loans</p>
              </CardContent>
            </Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--text-gray-900)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <History style={{ color: '#2563eb' }} />
              Active Loans
            </h2>

            <AnimatePresence mode="popLayout">
              {fetching ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[1, 2].map(i => (
                    <div key={i} style={{ height: '10rem', backgroundColor: 'var(--bg-gray-50)', borderRadius: '1.5rem', animation: 'pulse 2s infinite' }}></div>
                  ))}
                </div>
              ) : activeLoans.length > 0 ? (
                <div className="history-list">
                  {activeLoans.map((loan, idx) => (
                    <motion.div
                      key={loan.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="history-item"
                    >
                      <div className="flex" style={{ flexDirection: 'column', justifyContent: 'space-between', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div className="flex" style={{ alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-gray-900)' }}>{loan.amount} ETH</span>
                            <span className={`badge ${loan.status === 'Active' ? 'badge-active' : 'badge-requested'}`}>
                              {loan.status}
                            </span>
                          </div>
                          <div className="flex" style={{ flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-gray-500)' }}>
                            <div className="flex" style={{ alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-gray-50)', padding: '0.375rem 0.75rem', borderRadius: '0.75rem' }}>
                              <Clock size={16} style={{ color: '#2563eb' }} />
                              <span>Due: {loan.dueDate}</span>
                            </div>
                            <div className="flex" style={{ alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-gray-50)', padding: '0.375rem 0.75rem', borderRadius: '0.75rem' }}>
                              <CheckCircle2 size={16} style={{ color: 'var(--brand-600)' }} />
                              <span>Repaid: {loan.totalRepaid} ETH</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex" style={{ alignItems: 'center' }}>
                          <Button
                            onClick={() => handleRepay(loan.id)}
                            style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--text-gray-900)', color: 'white' }}
                          >
                            Repay Now
                            <ArrowUpRight size={20} style={{ marginLeft: '8px' }} />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="flex" style={{ justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-gray-400)', textTransform: 'uppercase' }}>
                          <span>Progress</span>
                          <span>{((Number(loan.totalRepaid) / (Number(loan.amount) * 1.05)) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="progress-bar-bg">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(Number(loan.totalRepaid) / (Number(loan.amount) * 1.05)) * 100}%` }}
                            className="progress-bar-fill bg-green-600"
                          ></motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card"
                  style={{ borderStyle: 'dashed', borderWidth: '2px', padding: '5rem', textAlign: 'center', backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                >
                  <div style={{ width: '6rem', height: '6rem', backgroundColor: 'white', color: 'var(--text-gray-300)', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                    <History size={48} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-gray-900)', marginBottom: '1rem' }}>No Active Loans</h3>
                  <p className="page-subtitle" style={{ maxWidth: '20rem', margin: '0 auto' }}>Request your first micro-loan using the form on the left to start building your credit history.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
