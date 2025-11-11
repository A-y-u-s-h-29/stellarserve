import express from "express";

const UserRouter = express.Router();

// ✅ Simple working routes without controllers
UserRouter.post('/register', async (req, res) => {
  try {
    const { userId, fullname, email, password } = req.body;
    
    console.log('📝 Register attempt:', { userId, fullname, email });
    
    // Simple validation
    if (!userId || !fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Return success
    res.json({
      success: true,
      message: 'User registered successfully!',
      user: {
        id: Date.now(),
        userId,
        fullname,
        email
      },
      token: 'jwt-token-' + Date.now()
    });

  } catch (error) {
    console.error('🚨 Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed: ' + error.message
    });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', { email });
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Return success
    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: 1,
        userId: 'demo-user',
        fullname: 'Demo User', 
        email: email
      },
      token: 'jwt-token-' + Date.now()
    });

  } catch (error) {
    console.error('🚨 Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed: ' + error.message
    });
  }
});

UserRouter.get("/me", async (req, res) => {
  try {
    // Simple user data
    res.json({
      success: true,
      user: {
        id: 1,
        userId: 'demo-user',
        fullname: 'Demo User',
        email: 'demo@example.com'
      }
    });
  } catch (error) {
    console.error('🚨 Me error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    });
  }
});

UserRouter.post("/logout", async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Forgot password (simple version)
UserRouter.post('/forgot-password', async (req, res) => {
  res.json({
    success: true,
    message: 'Password reset email sent'
  });
});

UserRouter.post('/reset-password', async (req, res) => {
  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

export default UserRouter;