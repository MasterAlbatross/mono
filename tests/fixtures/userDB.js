const mongoose = require('mongoose');
const User = require('../../models/user');
const usernameVerification = require('../../models/usernameVerification');
const userOne1 = new User({
  email: 'master.albatross123@gmail.com',
  password: '12345678',
  firstName: 'master',
  lastName: 'shamim',
  userType: 'rider',
  isActive: true,
});

const userTwo2 = new User({
  email: 'shamim@gmail.com',
  password: '12345678',
  firstName: 'shamim',
  lastName: 'hassan',
  userType: 'admin',
  isActive: true,
});

const setupDatabase = async () => {
  await User.deleteMany();
  await usernameVerification.deleteMany();
  await userOne1.save();
  await userTwo2.save();
};

module.exports = {
  userOne1,
  userTwo2,
  setupDatabase,
};
