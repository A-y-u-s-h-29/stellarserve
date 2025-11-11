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
   resetPasswordToken: String,
  resetPasswordExpiry: Date
}, {
  timestamps: true // automatically adds createdAt and updatedAt
});

const User = mongoose.model('User', userSchema);
export default User;