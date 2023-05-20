GraphQL API Documentation
This documentation provides details about the GraphQL API endpoints and operations available in the system.

Types
User
Represents a user in the system.

| Field    | Type     | Description                   |
| -------- | -------- | ----------------------------- |
| id       | ID!      | The unique user ID            |
| username | String!  | The username                  |
| email    | String!  | The email address             |
| posts    | [Post!]! | The posts created by the user |

Post
Represents a post in the system.

| Field   | Type    | Description             |
| ------- | ------- | ----------------------- |
| id      | ID!     | The unique post ID      |
| title   | String! | The title of the post   |
| content | String! | The content of the post |
| author  | User!   | The author of the post  |

AuthPayload
Represents the authentication payload.

| Field | Type    | Description                           |
| ----- | ------- | ------------------------------------- |
| user  | User!   | The authenticated user                |
| token | String! | The authentication token for the user |

Directives
@skipAuth
A custom directive that can be applied to fields to skip authentication for the associated query or mutation. When this directive is used, the field can be accessed without requiring authentication.

Queries

user
Retrieves a user by their ID.

user(id: ID!): User @skipAuth
id (required): The ID of the user to retrieve.
post
Retrieves a post by its ID.

post(id: ID!): Post
id (required): The ID of the post to retrieve.
posts
Retrieves all posts in the system.

posts: [Post!]!
Mutations
createUser
Creates a new user in the system.

createUser(
username: String!
email: String!
password: String!
): AuthPayload!
username (required): The username of the user to create.
email (required): The email address of the user to create.
password (required): The password of the user to create.
login
Authenticates a user and generates an authentication token.

login(email: String!, password: String!): AuthPayload! @skipAuth
email (required): The email address of the user.
password (required): The password of the user.
updatePost
Updates an existing post.

updatePost(id: ID!, title: String, content: String!): Post!
id (required): The ID of the post to update.
title (optional): The updated title of the post.
content (required): The updated content of the post.
deletePost
Deletes a post from the system.

deletePost(id: ID!): Post!
id (required): The ID of the post to delete.

Error Handling
The API returns appropriate error responses in case of failures or invalid requests. The error responses will provide meaningful error messages to help identify and resolve issues.

Authentication and Authorization
The API uses authentication and authorization mechanisms to ensure secure access to protected resources. Most mutations and certain queries require authentication. The authentication token should be included in the request headers as follows:

Authorization: Bearer <token>

If a request fails due to missing or invalid authentication credentials, an error response will be returned.
