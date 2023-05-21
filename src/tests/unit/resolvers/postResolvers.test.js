const { ApolloServer, gql } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
const { postResolvers } = require("./postResolvers");
const { Post } = require("../../db/models/Post");
const { User } = require("../../db/models/User");

// Mocked data
const mockPosts = [
  { id: 1, title: "Post 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Post 2", content: "Content 2", userId: 2 },
];

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
  type Post {
    id: Int
    title: String
    content: String
    user: User
  }

  type User {
    id: Int
    username: String
    email: String
    password: String
  }

  type Query {
    posts: [Post]
  }
`;

// Mock the database functions
jest.mock("../../db/models/Post", () => ({
  findAll: jest.fn(),
}));

jest.mock("../../db/models/User", () => ({
  findByPk: jest.fn(),
}));

describe("Post Resolvers", () => {
  let server;
  let query;

  beforeAll(() => {
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers: postResolvers,
    });
    server = createTestClient(apolloServer);
    query = server.query;
  });

  beforeEach(() => {
    Post.findAll.mockReset();
    User.findByPk.mockReset();
  });

  describe("Query - posts", () => {
    it("should return all posts", async () => {
      Post.findAll.mockResolvedValueOnce(mockPosts);

      const { data } = await query({
        query: "{ posts { id, title, content } }",
      });

      expect(data).toEqual({ posts: mockPosts });
      expect(Post.findAll).toHaveBeenCalledTimes(1);
    });

    it("should return posts with associated user", async () => {
      Post.findAll.mockResolvedValueOnce(mockPosts);
      User.findByPk.mockImplementation((id) => {
        const user = mockUsers.find((u) => u.id === id);
        return Promise.resolve(user);
      });

      const { data } = await query({
        query: "{ posts { id, title, content, user { id, username, email } } }",
      });

      const expectedData = mockPosts.map((post) => ({
        ...post,
        user: mockUsers.find((user) => user.id === post.userId),
      }));

      expect(data).toEqual({ posts: expectedData });
      expect(Post.findAll).toHaveBeenCalledTimes(1);
      expect(User.findByPk).toHaveBeenCalledTimes(2); // Called twice for each post's user
    });
  });
});
