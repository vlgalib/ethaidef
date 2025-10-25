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
    // Prepare bridge transaction
    const bridgeTx = await nexusClient.prepareBridge({
      sourceChain: SUPPORTED_CHAINS[fromChain].id,
      destinationChain: SUPPORTED_CHAINS[toChain].id,
      amount: parseEther(amount),
      recipient: targetProtocol, // Protocol contract address
    });
    
    // Execute bridge
    const result = await nexusClient.executeBridge(bridgeTx);
    
    return {
      success: true,
      txHash: result.transactionHash,
      message: `Successfully bridged from ${fromChain} to ${toChain}`,
    };
  } catch (error) {
    console.error('Bridge error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bridge failed',
    };
  }
}