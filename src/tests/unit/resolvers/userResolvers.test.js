const User = require("../../../db/models/User");
const Post = require("../../../db/models/Post");
const auth = require("../../../utils/auth");
const userResolvers = require("../../../graphql/resolvers/userResolvers");

describe("User Resolvers", () => {
  //const { createUser, login, } = userResolvers;

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
      auth.generateToken = jest.fn().mockReturnValue(mockToken);

      // Call the createUser resolver
      const result = await userResolvers.Mutation.createUser(null, input);

      // Assertions
      expect(User.create).toHaveBeenCalledWith(input);
      expect(auth.generateToken).toHaveBeenCalledWith(createdUser);
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
      auth.comparePasswords = jest.fn().mockResolvedValue(true);

      // Mock the generateToken function to return a mock token
      const mockToken = "mockToken";
      auth.generateToken = jest.fn().mockReturnValue(mockToken);

      // Call the login resolver
      const result = await userResolvers.Mutation.login(null, input);

      // Assertions
      expect(User.findByEmail).toHaveBeenCalledWith(input.email);
      expect(auth.comparePasswords).toHaveBeenCalledWith(
        input.password,
        user.password
      );
      expect(auth.generateToken).toHaveBeenCalledWith(user);
      expect(result.user).toEqual(user);
      expect(result.token).toEqual(mockToken);
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
      user.getPosts = jest.fn().mockResolvedValue(posts);

      // Call the posts resolver
      const result = await userResolvers.User.posts(user);

      // Assertions
      expect(user.getPosts).toHaveBeenCalledWith();
      expect(result).toEqual(posts);
    });
  });
});

/*
// Mocked data
const mockUsers = [
  {
    id: 1,
    username: "user1",
    email: "user1@example.com",
    password: "password1",
  },
  {
    id: 2,
    username: "user2",
    email: "user2@example.com",
    password: "password2",
  },
];

// GraphQL schema for testing
const typeDefs = gql`
  type User {
    id: Int
    username: String
    email: String
    password: String
  }

  type Query {
    users: [User]
    user(id: Int): User
  }
`;

describe("User Resolvers", () => {
  let server;
  let query;

  beforeAll(() => {
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers: userResolvers,
    });
    server = createTestClient(apolloServer);
    query = server.query;
  });

  beforeEach(() => {
    User.findAll.mockReset();
    User.findByPk.mockReset();
    User.create.mockReset();
  });

  describe("Mutation - createUser", () => {
    it("should create a new user", async () => {
      const newUser = {
        username: "newuser",
        email: "newuser@example.com",
        password: "newpassword",
      };
      User.create.mockResolvedValueOnce(newUser);

      const { data } = await query({
        query: `
          mutation {
            createUser(username: "${newUser.username}", email: "${newUser.email}", password: "${newUser.password}") {
              id
              username
              email
              password
            }
          }
        `,
      });

      expect(data.createUser).toEqual(newUser);
      expect(User.create).toHaveBeenCalledTimes(1);
      expect(User.create).toHaveBeenCalledWith(newUser);
    });
  });
});
*/
