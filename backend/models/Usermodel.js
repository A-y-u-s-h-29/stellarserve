// models/Usermodel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  // Token storage - store the currently valid token for this user (simple approach)
  currentToken: {
    type: String,
    default: null
  },

  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpiry: Date
}, {
  timestamps: true // automatically adds createdAt and updatedAt
});

const User = mongoose.model('User', userSchema);
export default User;
