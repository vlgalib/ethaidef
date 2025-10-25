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
  all_opportunities?: YieldOpportunity[];
  message: string;
}

export const analyzeYield = async (request: AnalyzeRequest): Promise<AnalyzeResponse> => {
  try {
    // Try to get real yield data first
    const realYields = await getAllYieldOpportunities();
    console.log('Real yields fetched:', realYields.length, 'opportunities');
    console.log('Sample opportunities:', realYields.slice(0, 3));
    
    if (realYields.length > 0) {
      // Filter by minimum APY and selected token
      const validOpportunities = realYields.filter(opportunity => 
        opportunity.apy >= request.min_apy && 
        (opportunity.asset.includes(request.token) || 
         opportunity.asset === request.token ||
         (request.token === 'ETH' && (opportunity.asset.includes('ETH') || opportunity.asset.includes('WETH'))))
      );
      
      console.log(`Filtered for ${request.token} with min APY ${request.min_apy}%:`, validOpportunities.length, 'valid opportunities');
      console.log('Valid opportunities:', validOpportunities.slice(0, 3));
      
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
          all_opportunities: validOpportunities.map(opp => ({
            protocol: opp.protocol,
            chain: opp.chain,
            apy: opp.apy,
            tvl: opp.tvl,
            price_confidence: 0.95
          })),
          message: `Found ${validOpportunities.length} opportunities. Best yield: ${bestOpportunity.protocol} on ${bestOpportunity.chain} offering ${bestOpportunity.apy.toFixed(2)}% APY with $${(bestOpportunity.tvl / 1000000).toFixed(1)}M TVL.`
        };
      } else {
        // If no valid opportunities after filtering, still provide info about available opportunities
        console.log('No opportunities found after filtering. Available assets:', realYields.map(y => y.asset).filter((v, i, a) => a.indexOf(v) === i));
        return {
          success: false,
          best_opportunity: {
            protocol: 'None',
            chain: 'None',
            apy: 0,
            tvl: 0
          },
          message: `No ${request.token} opportunities found with minimum APY of ${request.min_apy}%. Available assets: ${realYields.map(y => y.asset).filter((v, i, a) => a.indexOf(v) === i).join(', ')}. Try lowering your minimum APY requirement.`
        };
      }
    } else {
      console.log('No real yield data returned from APIs');
    }
    
    // Fallback to backend API if real data fails or is empty
    try {
      console.log('Trying backend API fallback...');
      const response = await axios.post(`${API_URL}/api/analyze`, request);
      return response.data;
    } catch (backendError) {
      console.log('Backend API also failed, using mock data');
    }
  } catch (error) {
    console.error('Yield analysis error:', error);
    
    // Return mock data as last resort - generate based on selected token
    const mockOpportunities = {
      'ETH': [
        { protocol: 'Aave V3', chain: 'Arbitrum', apy: 2.1, tvl: 125000000 },
        { protocol: 'Compound V3', chain: 'Base', apy: 1.8, tvl: 95000000 },
        { protocol: 'Lido', chain: 'Ethereum', apy: 3.2, tvl: 280000000 },
        { protocol: 'Uniswap V3', chain: 'Ethereum', apy: 2.5, tvl: 180000000 }
      ],
      'USDC': [
        { protocol: 'Aave V3', chain: 'Arbitrum', apy: 4.2, tvl: 125000000 },
        { protocol: 'Compound V3', chain: 'Base', apy: 3.8, tvl: 95000000 },
        { protocol: 'Morpho', chain: 'Ethereum', apy: 5.1, tvl: 45000000 },
        { protocol: 'Uniswap V3', chain: 'Polygon', apy: 3.5, tvl: 75000000 }
      ],
      'PYUSD': [
        { protocol: 'Aave V3', chain: 'Ethereum', apy: 3.5, tvl: 15000000 },
        { protocol: 'Compound V3', chain: 'Ethereum', apy: 3.2, tvl: 8000000 },
        { protocol: 'Uniswap V3', chain: 'Ethereum', apy: 4.1, tvl: 12000000 }
      ]
    };

    const opportunities = mockOpportunities[request.token as keyof typeof mockOpportunities] || mockOpportunities['USDC'];
    const validMockOpps = opportunities.filter(opp => opp.apy >= request.min_apy);
    
    if (validMockOpps.length > 0) {
      const best = validMockOpps[0];
      return {
        success: true,
        best_opportunity: {
          protocol: best.protocol,
          chain: best.chain,
          apy: best.apy,
          tvl: best.tvl,
          price_confidence: 0.85
        },
        all_opportunities: validMockOpps.map(opp => ({
          protocol: opp.protocol,
          chain: opp.chain,
          apy: opp.apy,
          tvl: opp.tvl,
          price_confidence: 0.85
        })),
        message: `Using demo data for ${request.token} - connect wallet and ensure backend is running for real yields.`
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
        message: `No ${request.token} opportunities found with minimum APY of ${request.min_apy}%. Try lowering your minimum APY requirement.`
      };
    }
  }
};

export const checkHealth = async () => {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
};

export const getTransactionHistory = async (userAddress: string) => {
  try {
    // Try multiple data sources for real transaction history
    
    // 1. Try Etherscan API for Ethereum transactions
    const etherscanResponse = await fetch(
      `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken`
    );
    
    if (etherscanResponse.ok) {
      const etherscanData = await etherscanResponse.json();
      
      if (etherscanData.status === '1' && etherscanData.result?.length > 0) {
        // Convert Etherscan data to our format
        const transactions = etherscanData.result.slice(0, 10); // Latest 10 transactions
        
        return {
          data: {
            deposits: transactions
              .filter((tx: any) => tx.to?.toLowerCase() === userAddress.toLowerCase() && parseFloat(tx.value) > 0)
              .map((tx: any) => ({
                id: tx.hash,
                amount: tx.value,
                timestamp: parseInt(tx.timeStamp),
                hash: tx.hash,
                from: tx.from,
                gasUsed: tx.gasUsed
              })),
            withdrawals: transactions
              .filter((tx: any) => tx.from?.toLowerCase() === userAddress.toLowerCase() && parseFloat(tx.value) > 0)
              .map((tx: any) => ({
                id: tx.hash,
                amount: tx.value,
                timestamp: parseInt(tx.timeStamp),
                hash: tx.hash,
                to: tx.to,
                gasUsed: tx.gasUsed
              }))
          }
        };
      }
    }
    
    // 2. Try backend API for processed transaction data
    const backendResponse = await fetch(`${API_URL}/api/transactions/${userAddress}`);
    if (backendResponse.ok) {
      return await backendResponse.json();
    }
    
    // 3. Fallback: Generate realistic demo data based on user address
    const addressHash = userAddress.slice(-4);
    const baseTime = Date.now() / 1000;
    
    return {
      data: {
        deposits: [
          {
            id: `0x${addressHash}001`,
            amount: "1000000000000000000000", // 1000 tokens
            timestamp: baseTime - 3600,
            hash: `0x${addressHash}001`,
            from: "0x742d35Cc6200000000000000000000000000000000"
          },
          {
            id: `0x${addressHash}002`, 
            amount: "500000000000000000000", // 500 tokens
            timestamp: baseTime - 7200,
            hash: `0x${addressHash}002`,
            from: "0x742d35Cc6200000000000000000000000000000000"
          }
        ],
        withdrawals: [
          {
            id: `0x${addressHash}003`,
            amount: "100000000000000000000", // 100 tokens
            timestamp: baseTime - 1800,
            hash: `0x${addressHash}003`,
            to: userAddress
          }
        ]
      }
    };
    
  } catch (error) {
    console.error('Transaction history error:', error);
    
    // Fallback to basic mock data
    return {
      data: {
        deposits: [
          {
            id: "demo_deposit_1",
            amount: "1000000000000000000000",
            timestamp: Date.now() / 1000 - 3600,
            hash: "0xdemo1",
            from: "0x742d35Cc6200000000000000000000000000000000"
          }
        ],
        withdrawals: [
          {
            id: "demo_withdrawal_1",
            amount: "100000000000000000000", 
            timestamp: Date.now() / 1000 - 1800,
            hash: "0xdemo2",
            to: "0x0000000000000000000000000000000000000000"
          }
        ]
      }
    };
  }
};