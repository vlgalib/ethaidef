require('dotenv').config();
const { ethers } = require('hardhat');

async function main() {
  const address = '0xf1dFEBcC32e77213bdf0e59a0eD39c0D244BE54D';
  const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia.publicnode.com');
  
  console.log('🔍 Checking wallet balance...');
  console.log('📍 Address:', address);
  
  try {
    const balance = await provider.getBalance(address);
    const balanceEth = ethers.formatEther(balance);
    
    console.log('💰 Balance:', balanceEth, 'ETH');
    
    if (parseFloat(balanceEth) > 0.001) {
      console.log('✅ Sufficient balance for deployment!');
    } else {
      console.log('❌ Insufficient balance. Need at least 0.001 ETH for deployment.');
      console.log('🚰 Get Sepolia ETH from: https://sepoliafaucet.com/');
    }
  } catch (error) {
    console.error('❌ Error checking balance:', error.message);
  }
}

main().catch(console.error);