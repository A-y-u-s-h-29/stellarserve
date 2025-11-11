import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['submitted', 'processing', 'indexed', 'failed'],
    default: 'submitted'
  },
  googleIndexed: {
    type: Boolean,
    default: false
  },
  googleStatus: {
    type: String
  },
  googleResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  indexedAt: {
    type: Date
  },
  lastChecked: {
    type: Date
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Url', urlSchema);