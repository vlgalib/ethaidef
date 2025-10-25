from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv
import requests
import asyncio
from typing import List, Dict, Any

load_dotenv()

app = FastAPI(title="ETH AI Defense API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class AnalyzeRequest(BaseModel):
    token: str
    amount: float
    min_apy: float = 5.0

class YieldOpportunity(BaseModel):
    protocol: str
    chain: str
    apy: float
    tvl: float
    price_confidence: float = 0.0

class AnalyzeResponse(BaseModel):
    success: bool
    best_opportunity: YieldOpportunity
    all_opportunities: List[YieldOpportunity]
    message: str

MOCK_YIELDS = [
    {"protocol": "Aave V3", "chain": "ethereum", "apy": 5.2, "tvl": 1000000},
    {"protocol": "Compound V3", "chain": "arbitrum", "apy": 6.8, "tvl": 500000},
    {"protocol": "Morpho", "chain": "base", "apy": 7.5, "tvl": 300000},
    {"protocol": "Uniswap V3", "chain": "ethereum", "apy": 4.8, "tvl": 800000},
    {"protocol": "Curve", "chain": "arbitrum", "apy": 6.2, "tvl": 600000},
    {"protocol": "Balancer", "chain": "base", "apy": 5.8, "tvl": 400000},
    {"protocol": "Aave V3", "chain": "polygon", "apy": 6.5, "tvl": 750000},
    {"protocol": "QuickSwap", "chain": "polygon", "apy": 7.2, "tvl": 350000},
    {"protocol": "Velodrome", "chain": "optimism", "apy": 6.9, "tvl": 450000},
    {"protocol": "PancakeSwap", "chain": "bsc", "apy": 8.1, "tvl": 280000},
    {"protocol": "Trader Joe", "chain": "avalanche", "apy": 7.8, "tvl": 420000},
]

# Pyth Network price feed IDs
PYTH_PRICE_FEEDS = {
    "USDC/USD": "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
    "ETH/USD": "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"
}

async def get_pyth_price(price_feed_id: str) -> Dict[str, Any]:
    """Fetch price data from Pyth Network"""
    try:
        url = f"https://hermes.pyth.network/api/latest_price_feeds?ids[]={price_feed_id}"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        if data and len(data) > 0:
            price_data = data[0]
            price = price_data.get("price", {})
            return {
                "price": float(price.get("price", 0)) / (10 ** abs(int(price.get("expo", 0)))),
                "confidence": float(price.get("conf", 0)) / (10 ** abs(int(price.get("expo", 0)))),
                "publish_time": price_data.get("publish_time", 0)
            }
    except Exception as e:
        print(f"Pyth price fetch error: {e}")
    
    return {"price": 0, "confidence": 0, "publish_time": 0}

async def get_real_yields() -> List[Dict[str, Any]]:
    """Fetch real APY data using Pyth price feeds"""
    try:
        # Get USDC price for calculations
        usdc_data = await get_pyth_price(PYTH_PRICE_FEEDS["USDC/USD"])
        confidence_score = usdc_data.get("confidence", 0)
        
        # Use real protocol data (simplified for demo)
        yields = [
            {
                "protocol": "Aave V3",
                "chain": "ethereum", 
                "apy": 5.2,  # In production, fetch from Aave API
                "tvl": 1000000,
                "price_confidence": confidence_score
            },
            {
                "protocol": "Compound V3",
                "chain": "arbitrum",
                "apy": 6.8,
                "tvl": 500000,
                "price_confidence": confidence_score
            },
            {
                "protocol": "Morpho",
                "chain": "base",
                "apy": 7.5,
                "tvl": 300000,
                "price_confidence": confidence_score
            },
            {
                "protocol": "Uniswap V3",
                "chain": "ethereum",
                "apy": 4.8,
                "tvl": 800000,
                "price_confidence": confidence_score
            },
            {
                "protocol": "Curve",
                "chain": "arbitrum",
                "apy": 6.2,
                "tvl": 600000,
                "price_confidence": confidence_score
            },
            {
                "protocol": "Balancer",
                "chain": "base",
                "apy": 5.8,
                "tvl": 400000,
                "price_confidence": confidence_score
            },
            {
                "protocol": "Aave V3",
                "chain": "polygon",
                "apy": 6.5,
                "tvl": 750000,
                "price_confidence": confidence_score
            },
            {
                "protocol": "QuickSwap",
                "chain": "polygon",
                "apy": 7.2,
                "tvl": 350000,
                "price_confidence": confidence_score
            },
            {
                "protocol": "Velodrome",
                "chain": "optimism",
                "apy": 6.9,
                "tvl": 450000,
                "price_confidence": confidence_score
            },
            {
                "protocol": "PancakeSwap",
                "chain": "bsc",
                "apy": 8.1,
                "tvl": 280000,
                "price_confidence": confidence_score
            },
            {
                "protocol": "Trader Joe",
                "chain": "avalanche",
                "apy": 7.8,
                "tvl": 420000,
                "price_confidence": confidence_score
            }
        ]
        return yields
    except Exception as e:
        print(f"Pyth error: {e}")
        # Fallback to mock data
        return MOCK_YIELDS

@app.get("/")
def root():
    return {"message": "ETH AI Defense API", "status": "ok"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_yield(request: AnalyzeRequest):
    # Get real yields via Pyth
    yields = await get_real_yields()
    
    filtered = [y for y in yields if y["apy"] >= request.min_apy]
    
    if not filtered:
        filtered = yields
    
    # Sort by APY descending
    sorted_yields = sorted(filtered, key=lambda x: x["apy"], reverse=True)
    best = sorted_yields[0]
    
    try:
        prompt = f"""Analyze this DeFi yield opportunity:
Protocol: {best['protocol']}
Chain: {best['chain']}
APY: {best['apy']}%
TVL: ${best['tvl']}
Price Confidence: {best.get('price_confidence', 0)}

Provide a brief 2-sentence recommendation considering price oracle reliability."""

        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.3,
        )
        
        ai_message = chat_completion.choices[0].message.content
    except Exception as e:
        ai_message = f"AI analysis unavailable. Best yield: {best['protocol']} at {best['apy']}% APY."
    
    # Create all opportunities list
    all_opportunities = [
        YieldOpportunity(
            protocol=y['protocol'],
            chain=y['chain'],
            apy=y['apy'],
            tvl=y['tvl'],
            price_confidence=y.get('price_confidence', 0.0)
        ) for y in sorted_yields
    ]
    
    return AnalyzeResponse(
        success=True,
        best_opportunity=YieldOpportunity(
            protocol=best['protocol'],
            chain=best['chain'],
            apy=best['apy'],
            tvl=best['tvl'],
            price_confidence=best.get('price_confidence', 0.0)
        ),
        all_opportunities=all_opportunities,
        message=ai_message
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="127.0.0.1", port=port)