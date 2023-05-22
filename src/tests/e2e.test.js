const request = require("supertest");
const startServer = require("../server");

let server;

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await server.close();
});

describe("GraphQL API - End-to-End Tests", () => {
  it("should create a new post", async () => {
    const response = await request(server)
      .post("/graphql")
      .send({
        query: `
          mutation {
            createPost(title: "Test Post", content: "Lorem ipsum dolor sit amet") {
              id
              title
              content
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.createPost).toHaveProperty("id");
    expect(response.body.data.createPost.title).toBe("Test Post");
    expect(response.body.data.createPost.content).toBe(
      "Lorem ipsum dolor sit amet"
    );
  });

  it("should get a list of posts", async () => {
    const response = await request(server)
      .post("/graphql")
      .send({
        query: `
          query {
            posts {
              id
              title
              content
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.posts).toBeInstanceOf(Array);
  });

  // TODO: Add more end-to-end test cases for other API operations
});
