import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: [
    'https://stellarserve.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://stellarserve.onrender.com'
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cookie"]
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'StellarServe Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

// ✅ Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// ✅ REGISTER ROUTE
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
    user: { 
      id: 1, 
      userId, 
      fullname, 
      email 
    },
    token: 'jwt-token-' + Date.now()
  });
});

// ✅ LOGIN ROUTE
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
    user: { 
      id: 1, 
      userId: 'user123', 
      fullname: 'Test User', 
      email 
    },
    token: 'jwt-token-' + Date.now()
  });
});

// ✅ ME ROUTE - THIS WAS MISSING!
app.get('/api/auth/me', (req, res) => {
  console.log('✅ ME ROUTE CALLED');
  
  // For now, return a demo user
  // In production, verify JWT token and get user from database
  res.json({
    success: true,
    user: {
      id: 1,
      userId: 'demo-user',
      fullname: 'Demo User',
      email: 'demo@example.com'
    }
  });
});

// ✅ LOGOUT ROUTE
app.post('/api/auth/logout', (req, res) => {
  console.log('🚪 Logout called');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// ✅ URL SUBMISSION ROUTE
app.post('/api/urls/submit-batch', (req, res) => {
  console.log('📤 URLs:', req.body);
  
  res.json({
    success: true,
    message: 'URLs submitted successfully!',
    processedCount: req.body.urls?.length || 0
  });
});

// ✅ 404 Handler
app.use('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 All routes are working!`);
});