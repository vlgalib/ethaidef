# ETH AI Defense - Setup Instructions

## Quick Start

1. **Clone and Setup**:
   ```bash
   git clone https://github.com/vlgalib/ethaidef.git
   cd ethaidef
   ```

2. **Configure Environment**:
   - Copy your API keys to `backend/.env` and `contracts/.env`
   - Add your Groq API key to `backend/.env`:
   ```
   GROQ_API_KEY=your_groq_key_here
   ```

3. **Run Application** (Windows):
   ```bash
   # Double-click start.bat or run:
   start.bat
   ```

4. **Manual Start**:
   
   **Backend**:
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python main.py
   ```
   
   **Frontend** (in new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://127.0.0.1:5000

## Testing the Application

1. Open http://localhost:3000
2. Enter amount: 1000
3. Enter minimum APY: 5.0
4. Click "Find Best Yield"
5. Should see AI recommendation with protocol details

## API Endpoints

- `GET /health` - Check backend status
- `POST /api/analyze` - Analyze yield opportunities

## Technologies Used

- **Backend**: Python FastAPI + Groq AI
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Smart Contracts**: Solidity
- **AI**: Groq LLM (Llama 3.1)