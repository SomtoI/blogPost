const User = require("../../db/models/User");
const generateToken = require("../../utils/auth").generateToken;
const hashPassword = require("../../utils/auth").hashPassword;
const comparePasswords = require("../../utils/auth").comparePasswords;
const { authenticationError } = require("../../utils/errorHandling");

const userResolvers = {
  Query: {
    /*
    users: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
  
    user: async (_, { id }) => {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          throw new Error(`User with ID ${id} not found`);
        }

        return user;
      } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw new Error(`User with ID ${id} not found`);
      }
    },*/
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
          throw new Error("Invalid email ");
        }
        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid password");
        }
        const token = generateToken(user);
        return { user, token };
      } catch (error) {
        console.error("Error logging in:", error);
        throw new Error("Failed to log in", error);
      }
    },
  },

  User: {
    posts: async (user) => {
      try {
        const posts = await user.getPosts(); // Assuming the User model has a 'getPosts' association method
        return posts;
      } catch (error) {
        console.error(
          `Error fetching posts for user with ID ${user.id}:`,
          error
        );
        throw new Error(`Failed to fetch posts for user with ID ${user.id}`);
      }
    },
  },
};

module.exports = userResolvers;
