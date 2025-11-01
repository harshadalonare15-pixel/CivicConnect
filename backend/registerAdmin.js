require('dotenv').config();
console.log('MONGO_URI from .env:', process.env.MONGO_URI);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const registerAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for admin registration...');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123';

    let adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      console.log('Admin user already exists.');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      adminUser = new User({
        fullName: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        location: 'Admin Location',
      });

      await adminUser.save();
      console.log('Admin user created successfully!');
      console.log(`Email: ${adminEmail}, Password: ${adminPassword}`);
    }
    mongoose.connection.close();
  } catch (err) {
    console.error('Error registering admin user:', err.message);
    process.exit(1);
  }
};

registerAdmin();
