import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// ✅ CORS - Allow all for now
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'StellarServe Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is healthy!',
    environment: process.env.NODE_ENV
  });
});

// ✅ SIMPLE REGISTER - NO IMPORTS
app.post('/api/auth/register', (req, res) => {
  console.log('📝 Register:', req.body);
  
  const { userId, fullname, email, password } = req.body;
  
  if (!userId || !fullname || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields required'
    });
  }

  res.json({
    success: true,
    message: 'Registered successfully!',
    user: { id: 1, userId, fullname, email },
    token: 'temp-token-123'
  });
});

// ✅ SIMPLE LOGIN
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password required'
    });
  }

  res.json({
    success: true,
    message: 'Login successful!',
    user: { id: 1, userId: 'user123', fullname: 'Test User', email },
    token: 'temp-token-123'
  });
});

// ✅ URL SUBMISSION
app.post('/api/urls/submit-batch', (req, res) => {
  console.log('📤 URLs:', req.body);
  
  res.json({
    success: true,
    message: 'URLs submitted!',
    processedCount: req.body.urls?.length || 0
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});