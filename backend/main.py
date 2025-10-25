from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

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

class AnalyzeResponse(BaseModel):
    success: bool
    best_opportunity: YieldOpportunity
    message: str

MOCK_YIELDS = [
    {"protocol": "Aave V3", "chain": "ethereum", "apy": 5.2, "tvl": 1000000},
    {"protocol": "Compound V3", "chain": "arbitrum", "apy": 6.8, "tvl": 500000},
    {"protocol": "Morpho", "chain": "base", "apy": 7.5, "tvl": 300000},
]

@app.get("/")
def root():
    return {"message": "ETH AI Defense API", "status": "ok"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_yield(request: AnalyzeRequest):
    filtered = [y for y in MOCK_YIELDS if y["apy"] >= request.min_apy]
    
    if not filtered:
        filtered = MOCK_YIELDS
    
    best = max(filtered, key=lambda x: x["apy"])
    
    try:
        prompt = f"""Analyze this DeFi yield opportunity:
Protocol: {best['protocol']}
Chain: {best['chain']}
APY: {best['apy']}%
TVL: ${best['tvl']}

Provide a brief 2-sentence recommendation."""

        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.3,
        )
        
        ai_message = chat_completion.choices[0].message.content
    except Exception as e:
        ai_message = f"AI analysis unavailable. Best yield: {best['protocol']} at {best['apy']}% APY."
    
    return AnalyzeResponse(
        success=True,
        best_opportunity=YieldOpportunity(**best),
        message=ai_message
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="127.0.0.1", port=port)