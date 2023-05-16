import { buildSchema } from "graphql";

export default buildSchema(`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    created_at: String!
    updated_at: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    created_at: String!
    updated_at: String!
  }

  type Comment {
    post: Post!
    author: User!
    content: String!
    created_at: String!
    updated_at: String!
  }

  type Query {
    hello: String
    users: [User!]!
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
    createComment(postId: ID!, authorId: ID!, content: String!): Comment!
  }
`);
