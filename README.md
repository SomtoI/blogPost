# blogPost

This project is a GraphQL API for a blog platform that allows users to create and publish blog posts. It provides various endpoints for user authentication, creating, editing, and deleting blog posts, and managing comments.

Features
User signup and account creation
Authentication and authorization using JWT
CRUD operations for blog posts
Comment management for blog posts

## Technologies, Language & Tools

The project is built using the following technologies:

- [NodeJS](https://nodejs.org/en/) - JavaScript runtime environment
- [NPM](https://www.npmjs.com/) - as a package manager
- [Apollo-Server](https://www.apollographql.com/) - Robust GraphQL Server Framework (Version 3 used in this project, but currently deprecated)
- [Express](https://expressjs.com/) - server-side framework for NodeJS
- [Docker](https://www.docker.com/get-started/) - A containerization platform for packaging the application
- [Jest] - Javascript Framework for unit testing
- [Supertest] - Framework for Integration and end-to-end testing of GraphQL APIs

## PLEASE NOTE THESE INSTRUCTIONS ASSUME YOU HAVE DOCKER SET UP

To run the server, follow these steps:

1. In your terminal, run the command

```bash
docker pull somtoi/test-repository:tagname
```

This will pull the Docker image from the registry I've stored it in

2. run the command

```bash
docker run -p <your-host-port>:4000 somtoi/test-repository:tagname
```

This will run all the necessary installs needed and start the application

3. Test the API

## Verify That Everything Is Set Up Correctly

To verify that the frontend is working properly, go to [http://localhost:your-host-port/graphql](http://localhost:your-host-port/graphql). You should see the homepage that is a graphQL playground to test out the API
