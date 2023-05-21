const request = require("supertest");
const { ApolloServer } = require("apollo-server-express");
const { createTestClient } = require("apollo-server-testing");
const { typeDefs, resolvers } = require("../../graphql/schema");

// Create a test client for making requests to the Apollo Server
let server;
let query;

beforeAll(async () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  server = await apolloServer.start();

  const { query: clientQuery } = createTestClient(apolloServer);
  query = clientQuery;
});

describe("API Integration Tests", () => {
  // Define a variable to store the authentication token
  let authToken;

  // Define a variable to store the ID of a created post
  let postId;

  // Before all test cases, authenticate a user and retrieve the authentication token
  beforeAll(async () => {
    // Perform login mutation to authenticate a user
    const loginResponse = await mutate({
      mutation: gql`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
          }
        }
      `,
      variables: {
        email: "user1@example.com",
        password: "password1",
      },
    });

    authToken = loginResponse.data.login.token;
  });

  describe("Authentication Tests", () => {
    test("Should return an error when an unauthenticated user attempts to access a protected resolver", async () => {
      // Make a request to a protected resolver without providing an authentication token
      const response = await query({
        query: gql`
          query GetPosts {
            posts {
              id
              title
              content
            }
          }
        `,
      });

      // Expect the response to have an authentication error
      expect(response.errors[0].message).toEqual(
        "You are unauthorized to access this"
      );
    });

    test("Should return posts when an authenticated user fetches the posts", async () => {
      // Make a request to a protected resolver with the authentication token
      const response = await query({
        query: gql`
          query GetPosts {
            posts {
              id
              title
              content
            }
          }
        `,
      }).set("Authorization", `Bearer ${authToken}`);

      // Expect the response to have a list of posts
      expect(response.data.posts).toBeDefined();
    });
  });

  describe("Error Handling Tests", () => {
    test("Should return an error when sending a request with a non-existent resolver", async () => {
      // Make a request to a non-existent resolver
      const response = await query({
        query: gql`
          query NonExistentResolver {
            nonExistentResolver {
              id
              title
              content
            }
          }
        `,
      }).set("Authorization", `Bearer ${authToken}`);

      // Expect the response to have an error indicating the resolver doesn't exist
      expect(response.errors[0].message).toEqual(
        "Cannot query field 'nonExistentResolver' on type 'Query'"
      );
    });

    test("Should return an error when sending a request with missing or invalid parameters", async () => {
      // Make a request with missing or invalid parameters
      const response = await mutate({
        mutation: gql`
          mutation CreatePost($title: String!, $content: String!) {
            createPost(title: $title, content: $content) {
              id
              title
              content
            }
          }
        `,
        variables: {
          // Missing 'title' parameter
          content: "Test post content",
        },
      }).set("Authorization", `Bearer ${authToken}`);

      // Expect the response to have an error indicating missing or invalid parameters
      expect(response.errors[0].message).toContain(
        "Variable '$title' expected value of type 'String!' but got: undefined"
      );
    });

    test("Should return an error when sending a request with an invalid authentication token", async () => {
      // Make a request with an invalid authentication token
      const response = await mutate({
        mutation: gql`
          mutation CreatePost($title: String!, $content: String!) {
            createPost(title: $title, content: $content) {
              id
              title
              content
            }
          }
        `,
        variables: {
          title: "Test Post",
          content: "Test post content",
        },
      }).set("Authorization", "Bearer invalid-token"); // Provide an invalid authentication token

      // Expect the response to have an error indicating invalid authentication
      expect(response.errors[0].message).toEqual("Invalid authorization token");
    });
  });

  describe("Data Mutations Tests", () => {
    test("Should create a new post", async () => {
      // Make a request to create a new post
      const response = await mutate({
        mutation: gql`
          mutation CreatePost($title: String!, $content: String!) {
            createPost(title: $title, content: $content) {
              id
              title
              content
            }
          }
        `,
        variables: {
          title: "Test Post",
          content: "Test post content",
        },
      }).set("Authorization", `Bearer ${authToken}`);

      // Expect the response to have the newly created post
      expect(response.data.createPost).toBeDefined();

      // Store the ID of the created post for later use
      postId = response.data.createPost.id;
    });

    test("Should update an existing post", async () => {
      // Make a request to update an existing post
      const response = await mutate({
        mutation: gql`
          mutation UpdatePost($id: ID!, $title: String!, $content: String!) {
            updatePost(id: $id, title: $title, content: $content) {
              id
              title
              content
            }
          }
        `,
        variables: {
          id: postId, // Use the ID of the created post
          title: "Updated Test Post",
          content: "Updated test post content",
        },
      }).set("Authorization", `Bearer ${authToken}`);

      // Expect the response to have the updated post
      expect(response.data.updatePost).toBeDefined();
      expect(response.data.updatePost.title).toEqual("Updated Test Post");
      expect(response.data.updatePost.content).toEqual(
        "Updated test post content"
      );
    });

    test("Should delete an existing post", async () => {
      // Make a request to delete an existing post
      const response = await mutate({
        mutation: gql`
          mutation DeletePost($id: ID!) {
            deletePost(id: $id) {
              id
              title
              content
            }
          }
        `,
        variables: {
          id: postId, // Use the ID of the created post
        },
      }).set("Authorization", `Bearer ${authToken}`);

      // Expect the response to have the deleted post
      expect(response.data.deletePost).toBeDefined();
      expect(response.data.deletePost.id).toEqual(postId);
    });

    test("Should return an error when attempting to update a non-existent post", async () => {
      // Make a request to update a non-existent post
      const response = await mutate({
        mutation: gql`
          mutation UpdatePost($id: ID!, $title: String!, $content: String!) {
            updatePost(id: $id, title: $title, content: $content) {
              id
              title
              content
            }
          }
        `,
        variables: {
          id: "non-existent-id",
          title: "Updated Test Post",
          content: "Updated test post content",
        },
      }).set("Authorization", `Bearer ${authToken}`);

      // Expect the response to have an error indicating the post doesn't exist
      expect(response.errors[0].message).toEqual(
        "Post with ID non-existent-id not found"
      );
    });

    test("Should return an error when attempting to delete a non-existent post", async () => {
      // Make a request to delete a non-existent post
      const response = await mutate({
        mutation: gql`
          mutation DeletePost($id: ID!) {
            deletePost(id: $id) {
              id
              title
              content
            }
          }
        `,
        variables: {
          id: "non-existent-id",
        },
      }).set("Authorization", `Bearer ${authToken}`);

      // Expect the response to have an error indicating the post doesn't exist
      expect(response.errors[0].message).toEqual(
        "Post with ID non-existent-id not found"
      );
    });
  });
});
