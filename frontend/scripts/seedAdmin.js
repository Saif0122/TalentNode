const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "candidate" },
  provider: { type: String, default: "credentials" },
  password: { type: String, select: false },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!uri || !adminEmail || !adminPassword) {
    console.error("Missing MONGODB_URI, ADMIN_EMAIL, or ADMIN_PASSWORD in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
    } else {
      admin = await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        provider: "credentials"
      });
      console.log(`✅ Admin user ${adminEmail} created successfully.`);
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
