//SignUpModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Entry schema
const EntrySchema = new Schema({
  date: { type: Date, required: true },
  parameterName: { type: String, required: true },
  value: { type: String, required: true }
});

const postEntrySchema = new Schema({
  Entry: [EntrySchema]
})
// Create the Entry model
const Entry = mongoose.model('Entry', postEntrySchema);

// Define the schema for the pendingSignup model
const pendingSignupSchema = new Schema({
  Username: String,
  Password: String,
  Email: { type: String, unique: true },
  Phone: String, // Change type to String
  Role: String,
  Department: String,
  Unit: String,
  RNo: { type: Number, unique: true },
  Approved: { type: Boolean, default: false },
});

// Define the schema for the SignUp model
const SignupSchema = new Schema({
  Username: String,
  Password: String,
  Email: { type: String, unique: true },
  Phone: String, // Change type to String
  Role: String,
  Department: String,
  Unit: String,
  RNo: { type: Number, unique: true },
  Approved: { type: Boolean, default: false },
});

// Register the pendingSignup model with Mongoose
const PendingSignup = mongoose.model('pendingSignup', pendingSignupSchema);

// Register the SignUp model with Mongoose
const SignUp = mongoose.model('SignUp', SignupSchema);

// Export the models
module.exports = {
  SignUp,
  PendingSignup,
  Entry // Export the Entry model
};