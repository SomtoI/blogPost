const { gql } = require("apollo-server-express");

const typeDefs = gql`
  directive @skipAuth on FIELD_DEFINITION

  type User {
    id: ID!
    username: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    post(id: ID!): Post
    posts: [Post!]!
  }

  type Mutation {
    createUser(
      username: String!
      email: String!
      password: String!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createPost(title: String!, content: String!, authorId: ID!): Post!
    updatePost(id: ID!, title: String, content: String!): Post!
    deletePost(id: ID!): Post!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = typeDefs;
