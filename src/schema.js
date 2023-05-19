const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    createdAt: String!
    updatedAt: String!
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    createdAt: String!
    updatedAt: String!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    content: String!
    post: Post!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    user(id: ID!): User
    post(id: ID!): Post
    comment(id: ID!): Comment
    users: [User!]!
    posts: [Post!]!
    comments: [Comment!]!
    getCommentById(id: ID!): Comment
  }

  type Mutation {
    createUser(
      username: String!
      email: String!
      password: String!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(
      id: ID!
      username: String
      email: String
      password: String
    ): User!
    deleteUser(id: ID!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
    updatePost(id: ID!, title: String, content: String): Post!
    deletePost(id: ID!): Post!
    createComment(content: String!, postId: ID!, authorId: ID!): Comment!
    updateComment(id: ID!, content: String): Comment!
    deleteComment(id: ID!): Comment!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = typeDefs;
