"use client";

import { useState } from "react";
import { useWeb3 } from "@/lib/Web3Context";
import { 
  Settings, 
  Rocket, 
  Link as LinkIcon, 
  CheckCircle, 
  Wallet, 
  Droplets, 
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function Setup() {
  const { address, provider, connect } = useWeb3();
  const [newAddress, setNewAddress] = useState("");
  const [activeStep, setActiveStep] = useState(1);

  const saveAddress = (addr: string) => {
    if (!addr.startsWith("0x") || addr.length !== 42) {
      alert("Please enter a valid Ethereum address.");
      return;
    }
    localStorage.setItem("microfinance_address", addr);
    alert("Contract address updated! Refreshing page...");
    window.location.reload();
  };

  const steps = [
    {
      id: 1,
      title: "Wallet Setup",
      icon: <Wallet className="text-blue-600" />,
      description: "Install MetaMask and connect to the Sepolia Testnet."
    },
    {
      id: 2,
      title: "Get Test ETH",
      icon: <Droplets className="text-cyan-500" />,
      description: "Acquire free test ETH from faucets to pay for gas."
    },
    {
      id: 3,
      title: "Contract Link",
      icon: <LinkIcon className="text-green-600" />,
      description: "Connect the frontend to your deployed smart contract."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Sidebar Steps */}
        <div className="lg:col-span-4 space-y-4">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2">Onboarding</h1>
            <p className="text-gray-500 text-lg">Follow these steps to get started with EthioLend.</p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full text-left p-6 rounded-3xl border transition-all duration-300 flex items-center gap-6 ${
                  activeStep === step.id 
                    ? "bg-white border-blue-100 shadow-xl shadow-blue-900/5 ring-2 ring-blue-500/10" 
                    : "bg-transparent border-transparent grayscale opacity-50 hover:opacity-100 hover:grayscale-0 hover:bg-white/50"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  activeStep === step.id ? "bg-blue-50" : "bg-gray-100"
                }`}>
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-black text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-500 font-medium">{step.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="shadow-2xl shadow-gray-200/50">
                  <CardHeader className="p-10 pb-6">
                    <CardTitle className="text-3xl font-black">MetaMask Setup</CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 pt-0 space-y-8">
                    <p className="text-gray-600 text-lg leading-relaxed">
                      To interact with EthioLend, you need a Web3 wallet. We recommend using <span className="font-bold text-gray-900">MetaMask</span>.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <h4 className="font-black mb-2 flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={18} />
                          1. Install Extension
                        </h4>
                        <p className="text-sm text-gray-500">Download MetaMask for your browser from the official website.</p>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <h4 className="font-black mb-2 flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={18} />
                          2. Network: Sepolia
                        </h4>
                        <p className="text-sm text-gray-500">Switch your network to 'Sepolia Test Network' in MetaMask settings.</p>
                      </div>
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                      <Button size="lg" onClick={connect} className="flex-grow">
                        {address ? "Wallet Connected" : "Connect MetaMask Now"}
                      </Button>
                      <Button variant="outline" size="lg" onClick={() => setActiveStep(2)}>
                        Next Step <ChevronRight className="ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="shadow-2xl shadow-gray-200/50">
                  <CardHeader className="p-10 pb-6">
                    <CardTitle className="text-3xl font-black">Acquire Test ETH</CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 pt-0 space-y-8">
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Since we are on a testnet, you need test ETH to pay for transaction gas. It's completely free!
                    </p>
                    
                    <div className="space-y-4">
                      <a 
                        href="https://sepolia-faucet.pk910.de/" 
                        target="_blank" 
                        className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                            <Droplets className="text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-black">PoW Faucet</h4>
                            <p className="text-sm text-gray-500 font-medium">Mine test ETH in your browser.</p>
                          </div>
                        </div>
                        <ExternalLink size={20} className="text-gray-300 group-hover:text-blue-500 transition" />
                      </a>
                      
                      <a 
                        href="https://faucet.quicknode.com/drip" 
                        target="_blank" 
                        className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                            <Droplets className="text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-black">QuickNode Faucet</h4>
                            <p className="text-sm text-gray-500 font-medium">Instant drip of Sepolia ETH.</p>
                          </div>
                        </div>
                        <ExternalLink size={20} className="text-gray-300 group-hover:text-blue-500 transition" />
                      </a>
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                      <Button size="lg" className="flex-grow" onClick={() => setActiveStep(3)}>
                        I have test ETH
                      </Button>
                      <Button variant="ghost" size="lg" onClick={() => setActiveStep(1)}>
                        Back
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="shadow-2xl shadow-gray-200/50">
                  <CardHeader className="p-10 pb-6">
                    <CardTitle className="text-3xl font-black">Link Smart Contract</CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 pt-0 space-y-10">
                    <section className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><Rocket size={24} /></div>
                        <h4 className="text-xl font-black">Deploy via Terminal</h4>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        If you are the developer, run this command in your project root to deploy the latest version of the Microfinance contract:
                      </p>
                      <div className="bg-gray-900 text-green-400 p-6 rounded-2xl font-mono text-sm shadow-inner relative group">
                        <span className="opacity-50 select-none">$ </span>npm run deploy
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10"
                          onClick={() => navigator.clipboard.writeText("npm run deploy")}
                        >
                          Copy
                        </Button>
                      </div>
                    </section>

                    <div className="h-px bg-gray-100 w-full"></div>

                    <section className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><LinkIcon size={24} /></div>
                        <h4 className="text-xl font-black">Manual Connection</h4>
                      </div>
                      <p className="text-gray-600">Enter a specific contract address to connect manually.</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                          placeholder="0x..."
                          className="font-mono text-sm flex-grow"
                        />
                        <Button
                          onClick={() => saveAddress(newAddress)}
                          className="sm:px-10"
                        >
                          Save Link
                        </Button>
                      </div>
                    </section>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                      <Button size="lg" variant="primary" className="flex-grow bg-green-600" onClick={() => window.location.href = "/dashboard"}>
                        Go to Dashboard <ShieldCheck className="ml-2" />
                      </Button>
                      <Button variant="ghost" size="lg" onClick={() => setActiveStep(2)}>
                        Back
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
