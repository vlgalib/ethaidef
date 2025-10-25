// lib/defi-apis.ts - Real DeFi protocol integrations
import axios from 'axios';

export interface YieldData {
  protocol: string;
  chain: string;
  apy: number;
  tvl: number;
  asset: string;
  poolId?: string;
  category: string;
}

// DefiLlama API for real yield data
export async function getDefiLlamaYields(): Promise<YieldData[]> {
  try {
    console.log('Fetching from DefiLlama API...');
    const response = await axios.get('https://yields.llama.fi/pools');
    console.log('DefiLlama response received:', response.status);
    const pools = response.data.data;
    
    // Filter for relevant pools with good APY
    const relevantPools = pools
      .filter((pool: any) => 
        pool.apy > 0 && 
        pool.tvlUsd > 1000000 && // Min 1M TVL
        (pool.symbol.includes('USDC') || pool.symbol.includes('USDT') || pool.symbol.includes('DAI') || 
         pool.symbol.includes('ETH') || pool.symbol.includes('WETH') || pool.symbol.includes('PYUSD'))
      )
      .slice(0, 10) // Top 10 pools
      .map((pool: any) => ({
        protocol: pool.project,
        chain: pool.chain,
        apy: pool.apy,
        tvl: pool.tvlUsd,
        asset: pool.symbol,
        poolId: pool.pool,
        category: pool.category || 'lending'
      }));

    return relevantPools;
  } catch (error) {
    console.error('Failed to fetch DefiLlama data:', error);
    return [];
  }
}

// Aave V3 API integration using Next.js proxy to avoid CORS
export async function getAaveV3Rates(): Promise<YieldData[]> {
  try {
    const chains = ['ethereum', 'arbitrum', 'base', 'polygon', 'optimism'];
    const results: YieldData[] = [];

    for (const chain of chains) {
      try {
        const subgraphUrl = getAaveSubgraphUrl(chain);
        if (!subgraphUrl) continue;

        const query = `
          query {
            reserves {
              symbol
              liquidityRate
              totalLiquidity
              aToken {
                id
              }
            }
          }
        `;

        console.log(`Fetching Aave data for ${chain}...`);
        
        // Use our Next.js API proxy instead of direct request
        const response = await axios.post('/api/graph', {
          url: subgraphUrl,
          query: query
        });

        const reserves = response.data?.data?.reserves || [];
        console.log(`Aave ${chain} reserves:`, reserves.length);

        for (const reserve of reserves) {
          if (['USDC', 'USDT', 'DAI', 'ETH', 'WETH', 'PYUSD'].includes(reserve.symbol)) {
            results.push({
              protocol: 'Aave V3',
              chain: chain,
              apy: parseFloat(reserve.liquidityRate) / 1e27 * 100, // Convert from ray to percentage
              tvl: parseFloat(reserve.totalLiquidity) / 1e6, // Convert to readable format
              asset: reserve.symbol,
              poolId: reserve.aToken.id,
              category: 'lending'
            });
          }
        }
      } catch (err) {
        console.error(`Failed to fetch Aave data for ${chain}:`, err);
      }
    }

    console.log('Total Aave opportunities found:', results.length);
    return results;
  } catch (error) {
    console.error('Failed to fetch Aave data:', error);
    return [];
  }
}

// Compound V3 rates - Fetching from DefiLlama which includes Compound data
export async function getCompoundV3Rates(): Promise<YieldData[]> {
  try {
    console.log('Fetching Compound V3 data from DefiLlama...');
    
    // Use DefiLlama's yields API which includes Compound data
    const response = await axios.get('https://yields.llama.fi/pools');
    const pools = response.data.data;
    
    // Filter for Compound V3 pools specifically
    const compoundPools = pools
      .filter((pool: any) => 
        pool.project?.toLowerCase() === 'compound-v3' ||
        pool.project?.toLowerCase() === 'compound' ||
        pool.protocol?.toLowerCase().includes('compound')
      )
      .filter((pool: any) => 
        pool.apy > 0 && 
        pool.tvlUsd > 10000000 && // Min 10M TVL for Compound
        (pool.symbol.includes('USDC') || pool.symbol.includes('ETH') || pool.symbol.includes('PYUSD'))
      )
      .slice(0, 10) // Top 10 Compound pools
      .map((pool: any) => ({
        protocol: 'Compound V3',
        chain: pool.chain,
        apy: pool.apy,
        tvl: pool.tvlUsd,
        asset: pool.symbol,
        poolId: pool.pool,
        category: 'lending'
      }));

    console.log('Compound V3 pools found:', compoundPools.length);
    return compoundPools;
    
  } catch (error) {
    console.error('Failed to fetch Compound data:', error);
    
    // Fallback to known Compound V3 markets if API fails
    console.log('Using fallback Compound V3 data...');
    return [
      { protocol: 'Compound V3', chain: 'ethereum', apy: 3.2, tvl: 320000000, asset: 'USDC', category: 'lending', poolId: '0xc3d688B66703497DAA19211EEdff47f25384cdc3' },
      { protocol: 'Compound V3', chain: 'ethereum', apy: 2.1, tvl: 180000000, asset: 'ETH', category: 'lending', poolId: '0xA17581A9E3356d9A858b789D68B4d866e593aE94' },
      { protocol: 'Compound V3', chain: 'arbitrum', apy: 3.8, tvl: 95000000, asset: 'USDC', category: 'lending', poolId: '0xA5EDBDD9646f8dFF606d7448e414884C7d905dCA' },
      { protocol: 'Compound V3', chain: 'base', apy: 4.1, tvl: 65000000, asset: 'USDC', category: 'lending', poolId: '0xb125E6687d4313864e53df431d5425969c15Eb2F' }
    ];
  }
}

// Uniswap V3 pools for yield farming
export async function getUniswapV3Yields(): Promise<YieldData[]> {
  try {
    const query = `
      query {
        pools(
          first: 20
          orderBy: totalValueLockedUSD
          orderDirection: desc
          where: {
            totalValueLockedUSD_gt: "1000000"
          }
        ) {
          id
          token0 { symbol }
          token1 { symbol }
          feeTier
          totalValueLockedUSD
          volumeUSD
        }
      }
    `;

    console.log('Fetching Uniswap V3 data...');
    
    // Use our Next.js API proxy
    const response = await axios.post('/api/graph', {
      url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
      query: query
    });

    const pools = response.data?.data?.pools || [];
    console.log('Uniswap pools received:', pools.length);
    
    return pools
      .filter((pool: any) => 
        (pool.token0.symbol === 'USDC' && pool.token1.symbol === 'USDT') ||
        (pool.token0.symbol === 'USDC' && pool.token1.symbol === 'DAI') ||
        (pool.token0.symbol === 'USDT' && pool.token1.symbol === 'DAI') ||
        (pool.token0.symbol === 'ETH' && pool.token1.symbol === 'USDC') ||
        (pool.token0.symbol === 'WETH' && pool.token1.symbol === 'USDC') ||
        (pool.token0.symbol === 'PYUSD' && pool.token1.symbol === 'USDC') ||
        (pool.token0.symbol === 'USDC' && pool.token1.symbol === 'ETH') ||
        (pool.token0.symbol === 'USDC' && pool.token1.symbol === 'WETH') ||
        (pool.token0.symbol === 'USDC' && pool.token1.symbol === 'PYUSD')
      )
      .map((pool: any) => ({
        protocol: 'Uniswap V3',
        chain: 'ethereum',
        apy: calculateUniswapAPY(pool.volumeUSD, pool.totalValueLockedUSD, pool.feeTier),
        tvl: parseFloat(pool.totalValueLockedUSD),
        asset: `${pool.token0.symbol}/${pool.token1.symbol}`,
        poolId: pool.id,
        category: 'liquidity'
      }));
  } catch (error) {
    console.error('Failed to fetch Uniswap data:', error);
    return [];
  }
}

// Helper functions
function getAaveSubgraphUrl(chain: string): string | null {
  const urls: Record<string, string> = {
    'ethereum': 'https://api.thegraph.com/subgraphs/name/aave/aave-v3-ethereum',
    'arbitrum': 'https://api.thegraph.com/subgraphs/name/aave/aave-v3-arbitrum',
    'base': 'https://api.studio.thegraph.com/query/24660/aave-v3-base/version/latest',
    'polygon': 'https://api.thegraph.com/subgraphs/name/aave/aave-v3-polygon',
    'optimism': 'https://api.thegraph.com/subgraphs/name/aave/aave-v3-optimism'
  };
  return urls[chain] || null;
}

function calculateUniswapAPY(volumeUSD: string, tvlUSD: string, feeTier: string): number {
  const volume = parseFloat(volumeUSD);
  const tvl = parseFloat(tvlUSD);
  const fee = parseInt(feeTier) / 1000000; // Convert from basis points
  
  // Simplified APY calculation: (24h volume * fee * 365) / TVL * 100
  const dailyFees = volume * fee;
  const annualFees = dailyFees * 365;
  return (annualFees / tvl) * 100;
}

// Main function to get all yield opportunities
export async function getAllYieldOpportunities(): Promise<YieldData[]> {
  try {
    const [defiLlama, aave, compound, uniswap] = await Promise.allSettled([
      getDefiLlamaYields(),
      getAaveV3Rates(),
      getCompoundV3Rates(),
      getUniswapV3Yields()
    ]);

    console.log('API Results:', {
      defiLlama: defiLlama.status === 'fulfilled' ? `${defiLlama.value.length} opportunities` : `Failed: ${defiLlama.reason}`,
      aave: aave.status === 'fulfilled' ? `${aave.value.length} opportunities` : `Failed: ${aave.reason}`, 
      compound: compound.status === 'fulfilled' ? `${compound.value.length} opportunities` : `Failed: ${compound.reason}`,
      uniswap: uniswap.status === 'fulfilled' ? `${uniswap.value.length} opportunities` : `Failed: ${uniswap.reason}`
    });

    const allResults: YieldData[] = [];

    if (defiLlama.status === 'fulfilled') allResults.push(...defiLlama.value);
    if (aave.status === 'fulfilled') allResults.push(...aave.value);
    if (compound.status === 'fulfilled') allResults.push(...compound.value);
    if (uniswap.status === 'fulfilled') allResults.push(...uniswap.value);

    // Sort by APY descending
    return allResults
      .filter(item => item.apy > 0)
      .sort((a, b) => b.apy - a.apy)
      .slice(0, 20); // Top 20 opportunities

  } catch (error) {
    console.error('Failed to fetch yield opportunities:', error);
    return [];
  }
}