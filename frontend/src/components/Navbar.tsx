"use client";

import Link from "next/link";
import { useWeb3 } from "@/lib/Web3Context";
import { Wallet, Menu, X, LayoutDashboard, Coins, HandCoins, History, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";

const Navbar = () => {
  const { address, connect } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Lend", href: "/lend", icon: Coins },
    { name: "Borrow", href: "/borrow", icon: HandCoins },
    { name: "History", href: "/history", icon: History },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        <Link href="/" className="flex items-center gap-4">
          <div className="logo-icon">E</div>
          <span className="logo-text">EthioLend</span>
        </Link>

        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`nav-link ${isActive(link.href) ? "nav-link-active" : ""}`}
            >
              <link.icon size={16} />
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 desktop-only" style={{ display: 'none' }}>
          {/* We'll handle responsive display via standard CSS or inline for now */}
          <style jsx>{`
            @media (min-width: 768px) {
              .desktop-only { display: flex !important; }
            }
          `}</style>
          <Button
            onClick={connect}
            variant={address ? "outline" : "primary"}
            size="sm"
            style={{ borderRadius: '2rem' }}
          >
            {address ? (
              <>
                <UserCircle size={18} style={{ marginRight: '8px' }} />
                <span>{`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}</span>
              </>
            ) : (
              <>
                <Wallet size={18} style={{ marginRight: '8px' }} />
                <span>Connect Wallet</span>
              </>
            )}
          </Button>
        </div>

        <div className="mobile-only" style={{ display: 'block' }}>
           <style jsx>{`
            @media (min-width: 768px) {
              .mobile-only { display: none !important; }
            }
          `}</style>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-ghost"
            style={{ padding: '0.5rem', borderRadius: '0.75rem' }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: 'white',
              borderBottom: '1px solid var(--border-gray-100)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`nav-link ${isActive(link.href) ? "nav-link-active" : ""}`}
                  style={{ width: '100%', padding: '0.75rem 1rem' }}
                >
                  <link.icon size={20} />
                  <span>{link.name}</span>
                </Link>
              ))}
              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-gray-100)' }}>
                <Button
                  onClick={() => {
                    connect();
                    setIsOpen(false);
                  }}
                  className="w-full"
                >
                  <Wallet size={18} style={{ marginRight: '8px' }} />
                  <span>{address ? "Wallet Connected" : "Connect Wallet"}</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
