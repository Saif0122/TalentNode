require('dotenv').config();
const mongoose = require('mongoose');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/makeAdmin.js <email>');
  console.error('Example: node scripts/makeAdmin.js saif@email.com');
  process.exit(1);
}

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'users');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const result = await User.updateOne(
    { email: email.toLowerCase() },
    { $set: { role: 'admin', isActive: true } }
  );

  if (result.matchedCount === 0) {
    console.error(`No user found with email: ${email}`);
  } else {
    console.log(`Success! ${email} is now an admin.`);
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
