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