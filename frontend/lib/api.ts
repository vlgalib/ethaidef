import axios from 'axios';
import { getAllYieldOpportunities, YieldData } from './defi-apis';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export interface AnalyzeRequest {
  token: string;
  amount: number;
  min_apy: number;
}

export interface YieldOpportunity {
  protocol: string;
  chain: string;
  apy: number;
  tvl: number;
  price_confidence?: number;
}

export interface AnalyzeResponse {
  success: boolean;
  best_opportunity: YieldOpportunity;
  message: string;
}

export const analyzeYield = async (request: AnalyzeRequest): Promise<AnalyzeResponse> => {
  try {
    // Try to get real yield data first
    const realYields = await getAllYieldOpportunities();
    
    if (realYields.length > 0) {
      // Filter by minimum APY and find best opportunity
      const validOpportunities = realYields.filter(yield => yield.apy >= request.min_apy);
      
      if (validOpportunities.length > 0) {
        const bestOpportunity = validOpportunities[0]; // Already sorted by APY
        
        return {
          success: true,
          best_opportunity: {
            protocol: bestOpportunity.protocol,
            chain: bestOpportunity.chain,
            apy: bestOpportunity.apy,
            tvl: bestOpportunity.tvl,
            price_confidence: 0.95
          },
          message: `Found ${validOpportunities.length} opportunities. Best yield: ${bestOpportunity.protocol} on ${bestOpportunity.chain} offering ${bestOpportunity.apy.toFixed(2)}% APY with $${(bestOpportunity.tvl / 1000000).toFixed(1)}M TVL.`
        };
      } else {
        return {
          success: false,
          best_opportunity: {
            protocol: 'None',
            chain: 'None',
            apy: 0,
            tvl: 0
          },
          message: `No opportunities found with minimum APY of ${request.min_apy}%. Try lowering your minimum APY requirement.`
        };
      }
    }
    
    // Fallback to backend API if real data fails
    const response = await axios.post(`${API_URL}/api/analyze`, request);
    return response.data;
  } catch (error) {
    console.error('Yield analysis error:', error);
    
    // Return mock data as last resort
    return {
      success: true,
      best_opportunity: {
        protocol: 'Aave V3',
        chain: 'Arbitrum',
        apy: 4.2,
        tvl: 125000000,
        price_confidence: 0.85
      },
      message: 'Using demo data - connect wallet and ensure backend is running for real yields.'
    };
  }
};

export const checkHealth = async () => {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
};

export const getTransactionHistory = async (userAddress: string) => {
  try {
    // Query Envio GraphQL endpoint
    const response = await fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetUserHistory($user: String!) {
            deposits: YieldVault_Deposit(
              where: { user: $user }
              order_by: { timestamp: desc }
            ) {
              id
              amount
              timestamp
            }
            withdrawals: YieldVault_Withdraw(
              where: { user: $user }
              order_by: { timestamp: desc }
            ) {
              id
              amount
              timestamp
            }
          }
        `,
        variables: { user: userAddress },
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Envio query error:', error);
    // Return mock data for demo
    return {
      data: {
        deposits: [
          {
            id: "11155111_12345_1",
            amount: "1000000000000000000000",
            timestamp: Date.now() / 1000 - 3600
          },
          {
            id: "11155111_12344_1", 
            amount: "500000000000000000000",
            timestamp: Date.now() / 1000 - 7200
          }
        ],
        withdrawals: [
          {
            id: "11155111_12346_1",
            amount: "100000000000000000000", 
            timestamp: Date.now() / 1000 - 1800
          }
        ]
      }
    };
  }
};