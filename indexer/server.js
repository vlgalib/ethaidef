const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/dashboard') {
    fs.readFile(path.join(__dirname, 'dashboard.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading dashboard');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/api/transactions') {
    // Mock transaction data endpoint
    const mockData = {
      transactions: [
        {
          id: '1',
          type: 'deposit',
          hash: '0xa1b2c3d4e5f6789012345678901234567890abcdef123456789abcdef0123456',
          amount: '1.5',
          user: '0xf1dFEBcC32e77213bdf0e59a0eD39c0D244BE54D',
          timestamp: Date.now() - 3600000,
          gasUsed: '21000'
        },
        {
          id: '2',
          type: 'withdrawal',
          hash: '0xb2c3d4e5f6789012345678901234567890abcdef123456789abcdef01234567',
          amount: '0.8',
          user: '0x1234567890abcdef1234567890abcdef12345678',
          timestamp: Date.now() - 7200000,
          gasUsed: '18500'
        }
      ],
      stats: {
        totalVolume: 24567,
        activeUsers: 42,
        totalDeposits: 156,
        totalWithdrawals: 89
      }
    };
    
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(mockData));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 CrossYield Agent Dashboard running at http://localhost:${PORT}`);
  console.log(`📊 Envio HyperIndex Mock Dashboard`);
  console.log(`📍 Contract: 0x1Dbedf3bEaad6b0e3569d96951B18DB9e23f3352`);
  console.log(`🌐 Network: Sepolia Testnet`);
});