import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x026E6B9D63c12947eb749707C6cfc7Bd6A746BC9"; 
export const SEPOLIA_CHAIN_ID = "0xaa36a7";
export const LOCAL_CHAIN_ID = "0x7a69"; // 31337

export async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      // Allow either Sepolia (11155111) or Localhost (31337)
      if (network.chainId !== BigInt(11155111) && network.chainId !== BigInt(31337)) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError: any) {
          console.log("Could not switch to Sepolia, trying Localhost...");
          // If switching to Sepolia fails, user might want localhost
        }
      }
      
      return { address: accounts[0], provider };
    } catch (error) {
      console.error("User denied account access or error occurred:", error);
      return null;
    }
  } else {
    alert("Please install MetaMask!");
    return null;
  }
}
