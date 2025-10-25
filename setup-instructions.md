# ETH AI Defense - Setup Instructions

## ⚡ Quick Start

1. **Clone and Setup**:
   ```bash
   git clone https://github.com/vlgalib/ethaidef.git
   cd ethaidef
   ```

2. **Install Dependencies**:
   ```bash
   # Backend dependencies (if not already installed)
   cd backend
   pip install fastapi uvicorn python-dotenv groq --user
   cd ..
   
   # Frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Configure Environment**:
   - API key is already set in `backend/.env`
   - If needed, update with your own Groq API key

4. **Run Application** (Windows):
   ```bash
   # Start application:
   start.bat
   
   # Stop application (kills all processes and frees ports):
   stop.bat
   
   # Restart application (stop + start):
   restart.bat
   ```

5. **Manual Start**:
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   python main.py
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access Application**:
   - **Frontend**: http://localhost:3000 (Next.js will auto-find available port: 3001, 3002, etc.)
   - **Backend API**: http://127.0.0.1:5000

## 🧪 Testing the Application

1. Open the frontend URL shown in terminal (usually http://localhost:3000, 3001, or 3002)
2. Enter amount: 1000
3. Enter minimum APY: 5.0
4. Click "Find Best Yield 🚀"
5. Should see AI recommendation with protocol details

## 📡 API Endpoints

- `GET /` - Welcome message
- `GET /health` - Check backend status
- `POST /api/analyze` - Analyze yield opportunities

## 🛠️ Technologies Used

- **Backend**: Python FastAPI + Groq AI (Llama 3.1)
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Smart Contracts**: Solidity
- **AI**: Groq LLM for intelligent yield analysis

## 🚨 Troubleshooting

**Backend won't start:**
- Check if Python is installed: `python --version`
- Install dependencies: `pip install fastapi uvicorn python-dotenv groq --user`

**Frontend won't start:**
- Check if Node.js is installed: `node --version`
- Install dependencies: `npm install && npm install autoprefixer`
- Delete .next folder if permission errors: `rm -rf .next` (then restart)

**Missing autoprefixer error:**
- Run: `npm install autoprefixer`

**Port already in use:**
- Backend will auto-use port 5000
- Frontend will auto-try 3001, 3002, etc. if 3000 is busy

**Permission errors with .next folder:**
- Run `stop.bat` to kill all processes
- Delete .next folder manually
- Restart development server

**Clean restart:**
- Run `stop.bat` to stop everything
- Wait 2-3 seconds
- Run `start.bat` to start fresh

**Processes won't stop:**
- Run `stop.bat` as Administrator
- Or manually close terminal windows