import axios from 'axios';

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
  const response = await axios.post(`${API_URL}/api/analyze`, request);
  return response.data;
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