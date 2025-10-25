// lib/bridge-utils.ts
import { nexusClient, SUPPORTED_CHAINS } from './avail-config';
import { parseEther } from 'viem';

export interface BridgeParams {
  fromChain: keyof typeof SUPPORTED_CHAINS;
  toChain: keyof typeof SUPPORTED_CHAINS;
  amount: string;
  targetProtocol: string;
}

export async function bridgeAndInvest(params: BridgeParams) {
  const { fromChain, toChain, amount, targetProtocol } = params;
  
  try {
    // Use the correct bridge method from Nexus SDK
    const result = await nexusClient.bridge({
      fromChainId: SUPPORTED_CHAINS[fromChain].id,
      toChainId: SUPPORTED_CHAINS[toChain].id,
      amount: parseEther(amount),
      tokenAddress: '0x0000000000000000000000000000000000000000', // ETH
      recipient: targetProtocol, // Protocol contract address
    });
    
    return {
      success: true,
      txHash: result.hash || result.transactionHash,
      message: `Successfully bridged from ${fromChain} to ${toChain}`,
    };
  } catch (error) {
    console.error('Bridge error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bridge operation not available in demo mode',
    };
  }
}