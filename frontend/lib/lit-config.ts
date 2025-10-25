// lib/lit-config.ts
import * as LitJsSdk from '@lit-protocol/lit-node-client';

let litNodeClient: any;

export async function initLit() {
  if (litNodeClient) return litNodeClient;
  
  litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: 'datil-dev', // Supported testnet
    debug: false,
  });
  
  await litNodeClient.connect();
  return litNodeClient;
}

export async function createAutomatedAction(params: {
  conditions: string[];
  action: string;
  targetAddress: string;
}) {
  const client = await initLit();
  
  // Define automation conditions
  const litActionCode = `
    (async () => {
      // Check if yield drops below threshold
      const shouldExecute = ${params.conditions.join(' && ')};
      
      if (shouldExecute) {
        // Execute rebalance action
        const result = await Lit.Actions.callContract({
          chain: 'ethereum',
          contractAddress: '${params.targetAddress}',
          abi: [],
          functionName: '${params.action}',
          params: [],
        });
        
        Lit.Actions.setResponse({ response: result });
      }
    })();
  `;
  
  return litActionCode;
}