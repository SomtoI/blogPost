const User = require("../db/models/User");

const generateToken = require("../utils/auth").generateToken;
const hashPassword = require("../utils/auth").hashPassword;
const comparePasswords = require("../utils/auth").comparePasswords;

const userResolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
    getUserById: async (_, { id }) => {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          throw new Error(`User with ID ${id} not found`);
        }
        return user;
      } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw new Error(`Failed to fetch user with ID ${id}`);
      }
    },
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      try {
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
          username,
          email,
          password: hashedPassword,
        });
        const token = generateToken(user.get());
        return { user, token };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    },
    login: async (_, { email, password }) => {
      try {
        const user = await User.findByEmail(email);
        if (!user) {
          throw new Error("Invalid email or password");
        }
        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid email or password");
        }
        const token = generateToken(user);
        return { user, token };
      } catch (error) {
        console.error("Error logging in:", error);
        throw new Error("Failed to log in");
      }
    },
    updateUser: async (_, { id, input }) => {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          throw new Error(`User with ID ${id} not found`);
        }
        await user.update(input);
        return user;
      } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw new Error(`Failed to update user with ID ${id}`);
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          throw new Error(`User with ID ${id} not found`);
        }
        await user.destroy();
        return true;
      } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw new Error(`Failed to delete user with ID ${id}`);
      }
    },
  },
};

module.exports = userResolvers;
