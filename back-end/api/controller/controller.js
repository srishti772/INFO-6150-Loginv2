// controller.js
const UserService = require("../Service/service");

var emailPattern = /([\w\.-]+)@northeastern\.edu$/;
var passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
var namePattern = /^[a-zA-Z\s]+$/;

module.exports = {
  create: async (req, res) => {
    try {
      const { fullName, email, password } = req.body;
      const errors = await UserService.validateUser(fullName, email, password);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const newUser = await UserService.createUser(fullName, email, password);

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  edit: async (req, res) => {
    let update_email = req.params.email;
    let update_name = req.body.fullName;
    let update_password = req.body.password;

    console.log('inside put');

    const errors = await UserService.validateEdit(update_name, update_password);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const updatedUser = await UserService.editUser(update_email, update_name, update_password);

      if (!updatedUser) {
        return res.status(400).json({ message: 'User not found' });
      }

      res.status(201).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  delete: async (req, res) => {
    let deleteEmail = req.params.email;

    try {
      const deletedUser = await UserService.deleteUser(deleteEmail);

      if (!deletedUser) {
        return res.status(404).send({ message: 'User not found' });
      } else return res.status(200).send({ message: 'User deleted successfully: ' + deletedUser.fullName });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await UserService.getAllUsers();
      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'No users found in the database' });
      }

      const formattedUsers = users.map((user) => ({
        fullName: user.fullName,
        email: user.email,
        password: user.password,
      }));

      res.json(formattedUsers);
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: 'Internal Server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const errors = UserService.validateLogin(email, password);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const user = await UserService.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: 'Invalid Username' });
      }

      const isPasswordValid = await UserService.verifyPassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(404).json({ message: 'Password is incorrect!' });
      }

      return res.status(200).json({ message: 'Logged in Successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};
