const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Mock User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: { type: String, select: false }
});

// Mock hook
userSchema.pre('save', async function() {
  console.log('Hook started');
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log('Hook finished');
});

const User = mongoose.model('TestUserHooks', userSchema);

async function test() {
  try {
    console.log('Creating user...');
    const user = new User({ email: 'test@example.com', password: 'password123' });
    console.log('Saving user (Mock connection)...');
    // Note: This matches my actual code structure
    await user.save({ validateBeforeSave: false }); 
    console.log('Save complete!');
  } catch (error) {
    console.error('Test Failed!');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  }
}

test();
