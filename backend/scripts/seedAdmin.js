const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@talentnode.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    // Check if admin already exists
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user already exists. Updating password...');
      admin.password = adminPassword;
      admin.isActive = true;
      await admin.save();
    } else {
      console.log('Creating new admin user...');
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true,
        provider: 'credentials'
      });
    }

    console.log('Admin seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedAdmin();
