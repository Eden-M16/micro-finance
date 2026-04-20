"use client";

import { useWeb3 } from "@/lib/Web3Context";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { 
  CheckCircle2, 
  ArrowDownLeft,
  History as HistoryIcon,
  Search,
  Wallet,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function History() {
  const { address, contract, connect } = useWeb3();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (contract && address) {
      fetchHistory();
    }
  }, [contract, address]);

  const fetchHistory = async () => {
    if (!contract || !address) return;
    setLoading(true);
    try {
      const loanIds = await contract.getUserLoans(address);
      const loanPromises = loanIds.map((id: any) => contract.loans(id));
      const loanDetails = await Promise.all(loanPromises);
      
      const formatted = loanDetails.map((loan: any) => ({
        id: loan.id.toString(),
        type: "Loan Request",
        amount: ethers.formatEther(loan.amount),
        status: ["Requested", "Active", "Repaying", "Completed", "Defaulted"][Number(loan.status)],
        date: new Date(Number(loan.createdAt) * 1000).toLocaleDateString(),
        fullDate: new Date(Number(loan.createdAt) * 1000).toLocaleString(),
        rawStatus: Number(loan.status)
      })).reverse();
      
      setHistory(formatted);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const filteredHistory = history.filter(item => {
    if (filter === "All") return true;
    if (filter === "Active") return item.rawStatus === 1 || item.rawStatus === 2;
    if (filter === "Completed") return item.rawStatus === 3;
    return true;
  });

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
            backgroundColor: 'var(--bg-gray-50)', 
            color: 'var(--text-gray-400)', 
            borderRadius: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 2rem' 
          }}>
            <HistoryIcon size={48} />
          </div>
          <h2 className="page-title" style={{ fontSize: '2.5rem' }}>View History</h2>
          <p className="page-subtitle" style={{ marginBottom: '2.5rem' }}>Connect your wallet to see your full transaction history and loan activity on the blockchain.</p>
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
      <div className="page-header">
        <div style={{ maxWidth: '42rem' }}>
          <h1 className="page-title" style={{ fontSize: '3rem' }}>Activity</h1>
          <p className="page-subtitle" style={{ fontSize: '1.25rem' }}>Detailed log of your on-chain financial journey on EthioLend.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(243, 244, 246, 0.5)', padding: '0.375rem', borderRadius: '1rem', border: '1px solid var(--border-gray-100)' }}>
          {["All", "Active", "Completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.625rem 1.5rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 900,
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filter === f ? 'white' : 'transparent',
                color: filter === f ? 'var(--text-gray-900)' : 'var(--text-gray-400)',
                boxShadow: filter === f ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: '6rem', backgroundColor: 'var(--bg-gray-50)', borderRadius: '1.5rem', animation: 'pulse 2s infinite' }}></div>
              ))}
            </div>
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((tx, idx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card style={{ transition: 'all 0.3s' }}>
                  <CardContent style={{ padding: '1.5rem' }}>
                    <div className="flex" style={{ flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                      <div className="flex" style={{ alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: 'max-content' }}>
                        <div style={{ 
                          width: '3.5rem', 
                          height: '3.5rem', 
                          borderRadius: '1rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          flexShrink: 0,
                          backgroundColor: tx.rawStatus === 3 ? 'var(--brand-50)' : '#eff6ff',
                          color: tx.rawStatus === 3 ? 'var(--brand-600)' : '#2563eb'
                        }}>
                          {tx.rawStatus === 3 ? <CheckCircle2 size={24} /> : <ArrowDownLeft size={24} />}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-gray-900)' }}>{tx.type}</h3>
                          <div className="flex" style={{ alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-gray-400)' }}>
                            <span className="flex" style={{ alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {tx.date}</span>
                            <span style={{ width: '4px', height: '4rem', backgroundColor: 'var(--bg-gray-100)', borderRadius: '999px' }}></span>
                            <span style={{ fontFamily: 'monospace' }}>{tx.id.substring(0, 8)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex" style={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 'max-content', gap: '3rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-gray-900)' }}>{tx.amount} ETH</div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 900, 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.1em',
                            color: tx.rawStatus === 3 ? 'var(--brand-600)' : '#2563eb'
                          }}>
                            {tx.status}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" style={{ borderRadius: '0.75rem' }}>
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card"
              style={{ borderStyle: 'dashed', borderWidth: '2px', padding: '6rem', textAlign: 'center', backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
            >
              <div style={{ width: '5rem', height: '5rem', backgroundColor: 'white', color: 'var(--text-gray-300)', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                <Search size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-gray-900)', marginBottom: '1rem' }}>No Transactions Found</h3>
              <p className="page-subtitle" style={{ maxWidth: '20rem', margin: '0 auto' }}>Your blockchain activity will appear here once you start lending or borrowing.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
