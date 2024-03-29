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
- [Docker](https://docs.docker.com/get-started/) - A containerization platform for packaging the application
- [Jest] - Javascript Framework for unit testing
- [Supertest] - Framework for Integration and end-to-end testing of GraphQL APIs

#### PLEASE NOTE THESE INSTRUCTIONS ASSUME YOU HAVE DOCKER SET UP

To run the server, follow these steps:

1. In your terminal, run the command

```bash
docker pull somtoi/graphql-api:v1.0.0
```

This will pull the Docker image from the registry I've stored it in

2. run the command

```bash
docker run -p <your-host-port>:4000 somtoi/graphql-api:v1.0.0
```

Replace your-host-port with the port number you want your localhost to listen at. This will run all the necessary installs needed and start the application

3. Test the API

#### Verify That Everything Is Set Up Correctly

To verify that the frontend is working properly, go to [http://localhost:your-host-port/graphql](http://localhost:your-host-port/graphql). You should see the homepage that is a graphQL playground to test out the API.

For access to certain resolvers, token must be set as a Header variable in the 'Header' configuration located at the bottom of the sandbox page
It is in the format:

-Key: "Authorization"
-Value: "Bearer 'your-token'"

## Improvements and Final Thoughts

There are a couple of things that could have been done better/improved upon such as:

- I currently have the database set in locally. Ideally this would be a remote database, with configuration setting set up, and everything built in the docker container. In productin environments, this would likely be the case, and volumes added for data persistence, etc.
- As can be seen in past commits, previous iterations had a more expanded API set, with resolvers written to incorporate Comments. My program still builds a comment model but this is only to populate the database and build the data relationships. This was done just to simplify things and focus solely on the tasks given.
- More robust error handling could be done, specifically (in this case) around precise messaging of the particular error
- More expansive tests could be written

-The docker Container currently holds the .env file with environment variables. This is unsafe and not advisable and was only done for the sake of this project.
-I currently use a simple authentication check for access control. How ever, a much more efficient way would have been to use directives. In a bigger project this would be the ideal, and I did attempt to implement one, however it wasn't working quite right and as such I chose completeness of the functionality in this case.

I had the idea of building out a proper frontend tool for testing the API, but due to time constraints arising from work commitments, I couldn't achieve that. It would have been something along the lines of:
-built in react
-landing page prompts user to either sign up or log in. Signing up stores the info in the database.
-When user logs in, Token is set in authorization header. This eliminates the need to set it manually for testing.
-User is presented with a dropdown list of all the available resolvers, and they can select whichever they want to test, with fields being generated dynamically based on the selections.
