"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Shield, 
  Users, 
  TrendingUp, 
  Zap, 
  Globe, 
  HeartHandshake,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                backgroundColor: 'var(--brand-50)',
                color: 'var(--brand-700)',
                fontSize: '0.875rem',
                fontWeight: '700',
                marginBottom: '2rem',
                border: '1px solid var(--brand-100)'
              }}
            >
              <Zap size={16} />
              <span>Next Gen Microfinance for Ethiopia</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.1 }}
            >
              Financial Freedom <br />
              <span className="text-transparent bg-clip-text bg-gradient-ethiopia">
                Powered by Trust
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ fontSize: '1.25rem', color: 'var(--text-gray-600)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}
            >
              EthioLend bridges traditional Ethiopian community finance with modern blockchain technology. Fast, transparent, and secure.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center items-center gap-6"
              style={{ flexWrap: 'wrap' }}
            >
              <Link href="/dashboard">
                <Button size="lg">
                  Get Started Now
                  <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                </Button>
              </Link>
              <Link href="/lend">
                <Button variant="outline" size="lg">
                  Explore Pool
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section" style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Total Liquidity", value: "1,200+ ETH" },
              { label: "Active Loans", value: "450+" },
              { label: "Trusted Users", value: "2.5k+" },
              { label: "Avg. Interest", value: "5%" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="stat-card"
              >
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Built for Reliability</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-gray-600)', maxWidth: '600px', margin: '0 auto' }}>EthioLend combines the security of Ethereum with the needs of the Ethiopian community.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "On-Chain Identity",
                desc: "Your credit score is built through real transactions, making it portable and verifiable worldwide.",
                icon: <Users size={32} />,
                color: "#dbeafe",
                textColor: "#2563eb"
              },
              {
                title: "Instant Liquidity",
                desc: "No more waiting weeks for approval. If the pool has funds and you have the score, you get the loan.",
                icon: <Zap size={32} />,
                color: "#fef9c3",
                textColor: "#ca8a04"
              },
              {
                title: "Full Transparency",
                desc: "Every single transaction, repayment, and loan is recorded on the public ledger for all to see.",
                icon: <Shield size={32} />,
                color: "#dcfce7",
                textColor: "#16a34a"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card style={{ height: '100%', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                  <CardContent style={{ padding: '2.5rem' }}>
                    <div style={{
                      width: '4rem',
                      height: '4rem',
                      backgroundColor: feature.color,
                      color: feature.textColor,
                      borderRadius: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '2rem'
                    }}>
                      {feature.icon}
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>{feature.title}</h3>
                    <p style={{ color: 'var(--text-gray-600)', lineHeight: 1.6 }}>{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div style={{
            background: 'linear-gradient(to right, #15803d, #14532d)',
            borderRadius: '3rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '2rem' }}>Ready to join the future of finance?</h2>
            <p style={{ fontSize: '1.25rem', color: '#dcfce7', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', opacity: 0.9 }}>
              Join thousands of Ethiopians building their financial future on the blockchain.
            </p>
            <div className="flex justify-center items-center gap-6" style={{ flexWrap: 'wrap' }}>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" style={{ backgroundColor: 'white', color: '#14532d' }}>
                  Launch App
                </Button>
              </Link>
              <Link href="/setup">
                <Button size="lg" variant="outline" style={{ borderColor: 'white', color: 'white' }}>
                  How to Setup
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 0', borderTop: '1px solid var(--border-gray-100)' }}>
        <div className="container">
          <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '2rem' }}>
            <div className="flex items-center gap-2">
              <div className="logo-icon" style={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>E</div>
              <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>EthioLend</span>
            </div>
            <div style={{ color: 'var(--text-gray-500)', fontSize: '0.875rem' }}>
              © 2026 EthioLend. Built for the community.
            </div>
            <div className="flex gap-6">
              <Link href="#" style={{ color: 'var(--text-gray-400)' }}>Twitter</Link>
              <Link href="#" style={{ color: 'var(--text-gray-400)' }}>Discord</Link>
              <Link href="#" style={{ color: 'var(--text-gray-400)' }}>Github</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
