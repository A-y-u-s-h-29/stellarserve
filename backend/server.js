import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import UserRouter from './routers/UserRouters.js';
import router from './routers/urlRoutes.js';

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

// ✅ Use routers
app.use('/api/auth', UserRouter);
app.use("/api/urls", router);

// ✅ 404 Handler
app.use('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 4000;

// ✅ Simple server startup without database
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 All routes are working!`);
});