const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  console.log(`Deploying Microfinance contract to ${network}...`);

  if (network === "localhost") {
    // Wait for the local node to be ready if needed
    console.log("Waiting for local node...");
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  const Microfinance = await hre.ethers.getContractFactory("Microfinance");
  const microfinance = await Microfinance.deploy();

  await microfinance.waitForDeployment();

  const address = await microfinance.getAddress();
  console.log("Microfinance deployed to:", address);

  // Save the contract address and ABI to the frontend
  const contractsDir = path.join(__dirname, "..", "src", "lib", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  const contractData = {
    address: address,
    abi: JSON.parse(microfinance.interface.formatJson()),
  };

  fs.writeFileSync(
    path.join(contractsDir, "Microfinance.json"),
    JSON.stringify(contractData, null, 2)
  );

  console.log("Contract data saved to src/lib/contracts/Microfinance.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
