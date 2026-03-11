const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const users = [
  {
    name: 'Admin User',
    email: 'admin@talentnode.com',
    password: 'Password123',
    role: 'admin'
  }
];

const importData = async () => {
  try {
    console.log('Seeding database...');
    // Create admin user
    await User.create(users);

    console.log('Data Imported. IMPORTANT: Please change or remove the default admin user (admin@talentnode.demo / Password123) in a production environment!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    console.log('Destroying data...');
    await User.deleteMany();
    console.log('Data Destroyed');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
