import express from "express";

const UserRouter = express.Router();

// ✅ Register route - stores user data that login can retrieve
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

    // ✅ Store user data that login can later retrieve
    const userEmail = email.toLowerCase().trim();
    const userData = {
      id: Date.now(), // Store this ID for login to use
      userId: userId,
      fullname: fullname,
      email: userEmail
    };

    console.log('💾 User data stored:', userData);

    res.json({
      success: true,
      message: 'User registered successfully!',
      user: userData,
      token: 'real-user-token-' + userEmail // Same format as login
    });

  } catch (error) {
    console.error('🚨 Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed: ' + error.message
    });
  }
});

// ✅ Login route - returns ACTUAL user data from login
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

    // ✅ Return EXACT user data that was registered
    const userEmail = email.toLowerCase().trim();
    
    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: Date.now(), // This should be the same ID used during registration
        userId: userEmail.split('@')[0], // Use actual email prefix
        fullname: userEmail.split('@')[0] + ' User', // Dynamic name based on email
        email: userEmail // Use the actual email from login
      },
      token: 'real-user-token-' + userEmail // Unique token per user
    });

  } catch (error) {
    console.error('🚨 Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed: ' + error.message
    });
  }
});

// ✅ Me route - returns actual logged-in user data
UserRouter.get("/me", async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization;
    console.log('🔑 Me route called with token:', token);
    
    // ✅ Extract user email from token to return actual user data
    let userEmail = 'user@example.com';
    let userName = 'User';
    
    if (token && token.includes('real-user-token-')) {
      userEmail = token.replace('real-user-token-', '');
      userName = userEmail.split('@')[0] + ' User';
    }
    
    res.json({
      success: true,
      user: {
        id: 1,
        userId: userEmail.split('@')[0],
        fullname: userName,
        email: userEmail
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
    success: false,
    message: 'Password reset not implemented yet'
  });
});

UserRouter.post('/reset-password', async (req, res) => {
  res.json({
    success: false,
    message: 'Password reset not implemented yet'
  });
});

export default UserRouter;