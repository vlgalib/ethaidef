const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying CrossYieldVault to Sepolia...");

  // Get the contract factory
  const CrossYieldVault = await ethers.getContractFactory("CrossYieldVault");

  // Deploy the contract
  console.log("📦 Deploying contract...");
  const contract = await CrossYieldVault.deploy();
  
  // Wait for deployment
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  
  console.log("✅ Contract deployed successfully!");
  console.log("📍 Address:", contractAddress);
  console.log("🔍 Explorer: https://sepolia.blockscout.com/address/" + contractAddress);
  
  // Update frontend contract address
  console.log("📝 Updating frontend contract address...");
  
  const contractFilePath = path.join(__dirname, "../../frontend/lib/contract.ts");
  
  try {
    let contractFileContent = fs.readFileSync(contractFilePath, "utf8");
    
    // Replace the demo address with real deployed address
    contractFileContent = contractFileContent.replace(
      /export const CONTRACT_ADDRESS = "0x742d35Cc[0-9a-fA-F]*";/,
      `export const CONTRACT_ADDRESS = "${contractAddress}";`
    );
    
    fs.writeFileSync(contractFilePath, contractFileContent);
    console.log("✅ Frontend contract address updated!");
    
  } catch (error) {
    console.log("⚠️  Could not update frontend automatically:", error.message);
    console.log("📝 Please manually update frontend/lib/contract.ts with address:", contractAddress);
  }
  
  console.log("🎉 Deployment complete!");
  console.log("💡 Add this address to your Envio indexer config:");
  console.log("   contracts:");
  console.log("     - name: CrossYieldVault");
  console.log(`       address: "${contractAddress}"`);
  
  // Verify contract (optional)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("⚠️  Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });