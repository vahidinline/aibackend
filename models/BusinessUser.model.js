const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const BusinessUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  apiKey: { type: String, default: uuidv4 },
  company: String,
  password: { type: String, required: true },
  role: { type: String, default: 'business' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  status: { type: String, default: 'active' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  lastLogin: { type: Date },
  lastLogout: { type: Date },
  lastActivity: { type: Date },
  lastActivityType: { type: String },
  lastActivityData: { type: String },
  lastActivityDataId: { type: String },
  lastActivityDataName: { type: String },
  lastActivityDataStatus: { type: String },
  requestsMade: { type: Number, default: 0 },
  remainingUsage: { type: Number, default: 1000 },
});

module.exports = mongoose.model('BusinessUserSchema', BusinessUserSchema);
