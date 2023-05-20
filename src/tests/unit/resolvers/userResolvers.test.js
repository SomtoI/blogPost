const User = require("../../../db/models/User");
const Post = require("../../../db/models/Post");
const Comment = require("../../../db/models/Comment");
const auth = require("../../../utils/auth");
const userResolvers = require("../../../graphql/resolvers/userResolvers");

describe("User Resolvers", () => {
  describe("Query: users", () => {
    test("returns all users", async () => {
      // Mocking User.findAll() to return dummy users
      User.findAll = jest.fn().mockResolvedValueOnce([
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
      ]);

      const users = await userResolvers.Query.users();

      expect(users).toHaveLength(2);
      expect(users[0].id).toBe(1);
      expect(users[0].username).toBe("user1");
      // Additional assertions for user properties
    });

    test("throws an error if fetching users fails", async () => {
      // Mocking User.findAll() to throw an error
      User.findAll = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error"));

      await expect(userResolvers.Query.users()).rejects.toThrow(
        "Failed to fetch users"
      );
    });
  });

  describe("Query: user", () => {
    test("returns the user with the specified ID", async () => {
      const mockUserId = 1;
      const mockUser = { id: mockUserId, username: "testuser" };

      // Mocking User.findByPk() to return a user
      User.findByPk = jest.fn().mockResolvedValueOnce(mockUser);

      const user = await userResolvers.Query.user(null, { id: mockUserId });

      expect(user).toEqual(mockUser);
    });

    test("throws an error if user with the specified ID is not found", async () => {
      const mockUserId = 1;

      // Mocking User.findByPk() to return null
      User.findByPk = jest.fn().mockResolvedValueOnce(null);

      await expect(
        userResolvers.Query.user(null, { id: mockUserId })
      ).rejects.toThrow(`User with ID ${mockUserId} not found`);
    });

    test("throws an error if fetching user fails", async () => {
      const mockUserId = 1;

      // Mocking User.findByPk() to throw an error
      User.findByPk = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error"));

      await expect(
        userResolvers.Query.user(null, { id: mockUserId })
      ).rejects.toThrow(`User with ID ${mockUserId} not found`);
    });
  });

  //const { createUser, login, updateUser, deleteUser } = userResolvers;

  describe("Mutation: createUser", () => {
    test("should create a new user and return the user object and token", async () => {
      // Mock the input data
      const input = {
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
      };

      const createdUser = {
        id: 1,
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the User.create function to return a new user object
      User.create = jest.fn().mockResolvedValue(createdUser);

      // Mock the generateToken function to return a mock token
      const mockToken = "mockToken";
      const generateToken = jest.spyOn(auth, "generateToken");
      generateToken.mockReturnValue(mockToken);

      // Call the createUser resolver
      const result = await userResolvers.Mutation.createUser(null, input);

      // Assertions
      expect(User.create).toHaveBeenCalledWith(input);
      expect(result.user).toEqual(createdUser);
      expect(result.token).toEqual(mockToken);
    });
  });

  describe("Mutation: login", () => {
    test("should return the user object and token if login credentials are valid", async () => {
      // Mock the input data
      const input = {
        email: "testuser@example.com",
        password: "testpassword",
      };

      // Mock the User.findByEmail function to return a user object
      const user = { id: 1, email: input.email, password: "hashedpassword" };
      User.findByEmail = jest.fn().mockResolvedValue(user);

      // Mock the comparePasswords function to return true
      const comparePasswords = jest.spyOn(auth, "comparePasswords");
      comparePasswords.mockResolvedValue(true);

      // Mock the generateToken function to return a mock token
      const mockToken = "mockToken";
      const generateToken = jest.spyOn(auth, "generateToken");
      generateToken.mockReturnValue(mockToken);

      // Call the login resolver
      const result = await userResolvers.Mutation.login(null, input);

      // Assertions
      expect(User.findByEmail).toHaveBeenCalledWith(input.email);
      expect(comparePasswords).toHaveBeenCalledWith(
        input.password,
        user.password
      );
      expect(result.user).toEqual(user);
      expect(result.token).toEqual(mockToken);
    });
  });

  describe("Mutation: updateUser", () => {
    test("should update the user and return the updated user object", async () => {
      // Mock the input data
      const id = 1;
      const input = { username: "newusername", email: "newemail@example.com" };

      // Mock the User.findByPk function to return a user object
      const user = {
        id,
        username: "oldusername",
        email: "oldemail@example.com",
      };
      User.findByPk = jest.fn().mockResolvedValue(user);

      // Mock the user.update function to update the user object
      user.update = jest.fn().mockResolvedValue({ ...user, ...input });

      // Call the updateUser resolver
      const result = await userResolvers.Mutation.updateUser(null, {
        id,
        input,
      });

      // Assertions
      expect(User.findByPk).toHaveBeenCalledWith(id);
      expect(user.update).toHaveBeenCalledWith(input);
      expect(result).toEqual({ ...user, ...input });
    });
  });

  describe("Mutation: deleteUser", () => {
    test("should delete the user and return true", async () => {
      // Mock the input data
      const id = 1;

      // Mock the User.findByPk function to return a user object
      const user = { id, username: "testuser", email: "testuser@example.com" };
      User.findByPk = jest.fn().mockResolvedValue(user);

      // Mock the user.destroy function to delete the user object
      user.destroy = jest.fn().mockResolvedValue(true);

      // Call the deleteUser resolver
      const result = await userResolvers.Mutation.deleteUser(null, { id });

      // Assertions
      expect(User.findByPk).toHaveBeenCalledWith(id);
      expect(user.destroy).toHaveBeenCalled();
      expect(result).toEqual(true);
    });
  });

  describe("User resolver: posts", () => {
    test("should return the posts associated with the user", async () => {
      // Mock the user object
      const user = { id: 1 };

      // Mock the Post.findAll function to return an array of posts
      const posts = [
        { id: 1, title: "Post 1", content: "Content 1", authorId: user.id },
        { id: 2, title: "Post 2", content: "Content 2", authorId: user.id },
      ];
      Post.findAll = jest.fn().mockResolvedValue(posts);

      // Call the posts resolver
      const result = await userResolvers.User.posts(user);

      // Assertions
      expect(Post.findAll).toHaveBeenCalledWith({
        where: { authorId: user.id },
      });
      expect(result).toEqual(posts);
    });
  });

  describe("User resolver: comments", () => {
    test("should return the comments associated with the user", async () => {
      // Mock the user object
      const user = { id: 1 };

      // Mock the Comment.findAll function to return an array of comments
      const comments = [
        { id: 1, content: "Comment 1", postId: 1, authorId: user.id },
        { id: 2, content: "Comment 2", postId: 2, authorId: user.id },
      ];
      Comment.findAll = jest.fn().mockResolvedValue(comments);

      // Call the comments resolver
      const result = await userResolvers.User.comments(user);

      // Assertions
      expect(Comment.findAll).toHaveBeenCalledWith({
        where: { authorId: user.id },
      });
      expect(result).toEqual(comments);
    });
  });
});
