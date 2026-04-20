"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import MicrofinanceContract from "@/lib/contracts/Microfinance.json";

interface Web3ContextType {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;
  connect: () => Promise<void>;
  loading: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  provider: null,
  contract: null,
  connect: async () => {},
  loading: true,
});

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(true);

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        
        // Use the address from the JSON, localStorage, or a fallback
        let contractAddress = localStorage.getItem("microfinance_address") || MicrofinanceContract.address;
        
        const microfinanceContract = new ethers.Contract(
          contractAddress,
          MicrofinanceContract.abi,
          signer
        );

        setAddress(accounts[0]);
        setProvider(browserProvider);
        setContract(microfinanceContract);
      } catch (error) {
        console.error("Connection error:", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          await connect();
        }
      }
      setLoading(false);
    };
    checkConnection();
  }, []);

  return (
    <Web3Context.Provider value={{ address, provider, contract, connect, loading }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
