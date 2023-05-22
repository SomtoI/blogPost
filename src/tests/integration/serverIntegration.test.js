const request = require("supertest");
const { gql } = require("apollo-server-express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("../../graphql/schema.js");
const resolvers = require("../../graphql/resolvers/index");

// Create a test client for making requests to the Apollo Server
let server;
let queries = resolvers.Query;
let mutations = resolvers.Mutation;
let authToken;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

beforeAll(async () => {
  server = await apolloServer.start();
});

afterAll(async () => {
  await server.stop(); // Stop the server after all tests are complete
});

const query = async (query, variables = {}) => {
  const response = await request(server)
    .post("/graphql")
    .set("Authorization", `Bearer ${authToken}`)
    .send({ query, variables });

  return response;
};

describe("API Integration Tests", () => {
  // Before all test cases, authenticate a user and retrieve the authentication token
  beforeAll(async () => {
    const loginResponse = await apolloServer.executeOperation({
      mutation: mutations.login,
      variables: { email: "user1@example.com", password: "password1" },
    });

    authToken = loginResponse.token;
  });

  describe("Authentication Tests", () => {
    test("Should return an error when an unauthenticated user attempts to access a protected resolver", async () => {
      const response = await query(gql`
        query GetPosts {
          posts {
            id
            title
            content
          }
        }
      `);

      expect(response.errors[0].message).toEqual(
        "You are unauthorized to access this"
      );
    });

    test("Should return posts when an authenticated user fetches the posts", async () => {
      const response = await query(
        gql`
          query GetPosts {
            posts {
              id
              title
              content
            }
          }
        `
      );

      expect(response.body.data.posts).toBeDefined();
    });
  });

  describe("Error Handling Tests", () => {
    test("Should return an error when sending a request with a non-existent resolver", async () => {
      const response = await query(
        gql`
          query NonExistentResolver {
            nonExistentResolver {
              id
              title
              content
            }
          }
        `
      );

      expect(response.errors[0].message).toEqual(
        "Cannot query field 'nonExistentResolver' on type 'Query'"
      );
    });

    test("Should return an error when sending a request with missing or invalid parameters", async () => {
      const response = await query(
        gql`
          mutation CreatePost($title: String!, $content: String!) {
            createPost(title: $title, content: $content) {
              id
              title
              content
            }
          }
        `,
        {
          // Missing 'title' parameter
          content: "Test post content",
        }
      );

      expect(response.errors[0].message).toContain(
        "Variable '$title' expected value of type 'String!' but got: undefined"
      );
    });

    test("Should return an error when sending a request with an invalid authentication token", async () => {
      const response = await query(
        gql`
          mutation CreatePost($title: String!, $content: String!) {
            createPost(title: $title, content: $content) {
              id
              title
              content
            }
          }
        `,
        {
          title: "Test Post",
          content: "Test post content",
        }
      ).set("Authorization", "Bearer invalid-token"); // Provide an invalid authentication token

      expect(response.errors[0].message).toEqual("Invalid authorization token");
    });
  });

  describe("Data Mutations Tests", () => {
    let postId; //variable for storing ID of post to be used for testing

    test("Should create a new post", async () => {
      const response = await query(
        gql`
          mutation CreatePost($title: String!, $content: String!) {
            createPost(title: $title, content: $content) {
              id
              title
              content
            }
          }
        `,
        {
          title: "Test Post",
          content: "Test post content",
        }
      );

      // Expect the response to have the newly created post
      expect(response.body.data.createPost).toBeDefined();

      // Store the ID of the created post for later use
      postId = response.body.data.createPost.id;
    });

    test("Should update an existing post", async () => {
      const response = await query(
        gql`
          mutation UpdatePost($id: ID!, $title: String!, $content: String!) {
            updatePost(id: $id, title: $title, content: $content) {
              id
              title
              content
            }
          }
        `,
        {
          id: postId,
          title: "Updated Test Post",
          content: "Updated test post content",
        }
      );

      expect(response.data.updatePost).toBeDefined();
      expect(response.data.updatePost.title).toEqual("Updated Test Post");
      expect(response.data.updatePost.content).toEqual(
        "Updated test post content"
      );
    });

    test("Should delete an existing post", async () => {
      const response = await query(
        gql`
          mutation DeletePost($id: ID!) {
            deletePost(id: $id) {
              id
              title
              content
            }
          }
        `,
        {
          id: postId,
        }
      );

      expect(response.data.deletePost).toBeDefined();
      expect(response.data.deletePost.id).toEqual(postId);
    });

    test("Should return an error when attempting to update a non-existent post", async () => {
      const response = await query(
        gql`
          mutation UpdatePost($id: ID!, $title: String!, $content: String!) {
            updatePost(id: $id, title: $title, content: $content) {
              id
              title
              content
            }
          }
        `,
        {
          id: "non-existent-id",
          title: "Updated Test Post",
          content: "Updated test post content",
        }
      );

      expect(response.errors[0].message).toEqual(
        "Post with ID non-existent-id not found"
      );
    });

    test("Should return an error when attempting to delete a non-existent post", async () => {
      const response = await query(
        gql`
          mutation DeletePost($id: ID!) {
            deletePost(id: $id) {
              id
              title
              content
            }
          }
        `,
        {
          id: "non-existent-id",
        }
      );

      expect(response.errors[0].message).toEqual(
        "Post with ID non-existent-id not found"
      );
    });
  });
});
