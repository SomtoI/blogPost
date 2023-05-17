import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    createdAt: String!
    updatedAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [PostComment!]!
    createdAt: String!
    updatedAt: String!
  }

  type PostComment {
    id: ID!
    content: String!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
    createComment(content: String!, authorId: ID!, postId: ID!): PostComment!
  }
`;

export default typeDefs;
