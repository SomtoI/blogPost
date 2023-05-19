const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} = require("apollo-server-core");
const typeDefs = require("./schema.js");
const resolvers = require("./resolvers/index");
//const { User, Post, Comment } = require("./models/index");
const { authenticateUser } = require("./utils/authMiddleware");

require("dotenv").config();

const startServer = async () => {
  try {
    const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(morgan("dev"));

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        // Extract the authenticated user from the request
        const user = authenticateUser(req);
        return { user };
      },
      //Apollo sandbox to be able to make queries to the GraphQL endpoints in the browser
      plugins: [
        process.env.NODE_ENV === "production"
          ? ApolloServerPluginLandingPageProductionDefault({
              graphRef: "my-graph-id@my-graph-variant",
              footer: false,
            })
          : ApolloServerPluginLandingPageGraphQLPlayground({
              embed: false,
              footer: false,
            }),
      ],
    });

    await server.start();

    server.applyMiddleware({ app, path: "/graphql" }); //Applied the Apollo Server middleware to the Express App

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`GraphQL endpoint: ${server.graphqlPath}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer().catch((error) => console.error("Error starting server:", error));
//Commented out code for connecting to external DB
/*
const models = { User, Post, Comment };
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database.");

    models.sequelize
      .sync({ force: true }) // force set to true so every time the server is restarted the table gets dropped and created again
      .then(() => {
        console.log("Database synced. Seeding");
        // Seed the database before starting the server
        seedDatabase()
          .then(() => {
            app.listen(PORT, () => {
              console.log(`Server running on port ${PORT}`);
              console.log(`GraphQL endpoint: ${server.graphqlPath}`);
            });
          })
          .catch((error) => {
            console.error("Error seeding the database:", error);
          });
      })
      .catch((error) => {
        console.error("Database synchronization error:", error);
      });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
*/
