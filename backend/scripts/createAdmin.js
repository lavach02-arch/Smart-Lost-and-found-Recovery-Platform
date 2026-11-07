const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function promoteAdmin() {
  const emailArg = process.argv[2] || process.env.ADMIN_EMAIL;

  if (!emailArg) {
    console.log('Usage: node scripts/createAdmin.js <user-email>');
    console.log('Example: node scripts/createAdmin.js admin@example.com');
    process.exit(1);
  }

  try {
    if (!MONGO_URI) {
      console.error('Error: MONGO_URI environment variable is missing.');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');

    const emailClean = emailArg.toLowerCase().trim();
    const user = await User.findOne({ email: emailClean });

    if (!user) {
      console.error(`User with email "${emailClean}" not found.`);
      process.exit(1);
    }

    user.role = 'ADMIN';
    user.status = 'ACTIVE';
    await user.save();

    console.log(`====================================================`);
    console.log(`🎉 SUCCESS: User "${user.name}" (${user.email}) has been promoted to ADMIN!`);
    console.log(`Role: ${user.role} | Status: ${user.status}`);
    console.log(`====================================================`);

    process.exit(0);
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    process.exit(1);
  }
}

promoteAdmin();
