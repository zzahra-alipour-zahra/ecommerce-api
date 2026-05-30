const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./model/User');

dotenv.config({ path: './config.env' });

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_LOCAL);

    const adminExists = await User.findOne({
      email: 'admin@test.com'
    });

    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@test.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'admin'
      });

      console.log('Admin created');
    }

    const userExists = await User.findOne({
      email: 'user@test.com'
    });

    if (!userExists) {
      await User.create({
        name: 'Demo User',
        email: 'user@test.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'user'
      });

      console.log('Demo user created');
    }

    console.log('Seeding completed');
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
