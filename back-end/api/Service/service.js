// service.js
const User = require('../model/user');

const emailPattern = /([\w\.-]+)@northeastern\.edu$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
const namePattern = /^[a-zA-Z\s]+$/;

module.exports = {
  validateUser: async (fullName, email, password) => {
    const errors = [];

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        errors.push('Email is already in use');
        return errors;
    }

    if (!emailPattern.test(email)) {
      errors.push('Use a valid northeastern email address');
    }

    if (fullName.length < 2) {
      errors.push('First name must be at least 2 characters long');
    }

    if (!namePattern.test(fullName)) {
      errors.push('Invalid characters in name');
    }

    if (!passwordPattern.test(password)) {
      errors.push('Password must be 8 to 10 characters long with 1 uppercase letter, number, and special character');
    }


    return errors;
  },

  createUser: async (fullName, email, password) => {
    const existingUser = await User.findOne({ email });
    
    const newUser = new User({
      fullName,
      email,
      password,
    });

    return newUser.save();
  },

  validateEdit: async (update_name, update_password) => {
    const errors = [];

    if (update_name.length < 2) {
      errors.push('First name must be at least 2 characters long');
    }

    if (!namePattern.test(update_name)) {
      errors.push('Invalid characters in name');
    }

    if (!passwordPattern.test(update_password)) {
      errors.push('Password must be 8 to 10 characters long with 1 uppercase letter, number, and special character');
    }

    return errors;
  },

  editUser: async (update_email, update_name, update_password) => {
    return User.findOneAndUpdate(
      { email: update_email },
      { $set: { fullName: update_name, password: update_password } },
      { new: true }
    );
  },

  deleteUser: async (deleteEmail) => {
    return User.findOneAndDelete({ email: deleteEmail });
  },

  getAllUsers: async () => {
    return User.find().exec();
  },

  validateLogin: (email, password) => {
    const errors = [];
    if (!emailPattern.test(email)) {
      errors.push('Use a valid northeastern email address');
    }
    if (!passwordPattern.test(password)) {
      errors.push('Password must be 8 to 10 characters long with 1 uppercase letter, number, and special character');
    }
    return errors;
  },

  getUserByEmail: async (email) => {
    return User.findOne({ email });
  },

  verifyPassword: async (plainPassword, hashedPassword) => {
    return plainPassword== hashedPassword;
  },
};
