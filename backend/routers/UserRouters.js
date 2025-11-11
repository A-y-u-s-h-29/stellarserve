import express from "express";

const UserRouter = express.Router();

// Store user data temporarily (in production, use database)
let users = [];

// ✅ Register route - stores REAL user data
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

    // ✅ Create user data
    const userEmail = email.toLowerCase().trim();
    const userData = {
      id: Date.now(),
      userId: userId,
      fullname: fullname,
      email: userEmail,
      password: password // In production, hash this
    };

    // Store user (in production, save to database)
    users.push(userData);
    console.log('💾 User registered:', userData);

    res.json({
      success: true,
      message: 'User registered successfully!',
      user: {
        id: userData.id,
        userId: userData.userId,
        fullname: userData.fullname,
        email: userData.email
      },
      token: 'user-token-' + userData.id
    });

  } catch (error) {
    console.error('🚨 Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed: ' + error.message
    });
  }
});

// ✅ Login route - returns REAL user data
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

    const userEmail = email.toLowerCase().trim();
    
    // ✅ Find user by email (in production, query database)
    const user = users.find(u => u.email === userEmail);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // ✅ Check password (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    console.log('✅ Login successful for:', user.email);

    // ✅ Return ACTUAL user data
    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        userId: user.userId,
        fullname: user.fullname,
        email: user.email
      },
      token: 'user-token-' + user.id
    });

  } catch (error) {
    console.error('🚨 Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed: ' + error.message
    });
  }
});

// ✅ Me route - returns ACTUAL logged-in user
UserRouter.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log('🔑 Me route called with token:', token);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // ✅ Extract user ID from token
    const userId = token.replace('user-token-', '');
    const user = users.find(u => u.id.toString() === userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    console.log('✅ Me route returning user:', user.email);

    // ✅ Return ACTUAL user data
    res.json({
      success: true,
      user: {
        id: user.id,
        userId: user.userId,
        fullname: user.fullname,
        email: user.email
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

// Forgot password
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