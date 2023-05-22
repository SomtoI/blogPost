const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { ApolloServer, ApolloError } = require("apollo-server-express");
const {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} = require("apollo-server-core");
const typeDefs = require("./graphql/schema.js");
const resolvers = require("./graphql/resolvers/index");
const { authenticateUser } = require("./utils/authMiddleware.js");
const { customErrorFormatter } = require("./utils/errorHandling");

require("dotenv").config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    const app = express();
    app.use(cors());
    app.use(
      helmet({
        contentSecurityPolicy:
          process.env.NODE_ENV === "production" ? undefined : false, //set to ensure Apollo Sandbox loads
      })
    );
    app.use(morgan("dev"));

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        // Extract the authenticated user from the request and confirm validity of authentication
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
          : ApolloServerPluginLandingPageLocalDefault({
              embed: false,
              footer: false,
            }),
      ],
      formatError: (error) => {
        return customErrorFormatter(error);
      },
    });

    await server.start(); //Start Server. Vital to ensure server connection works before adding it to Express App

    server.applyMiddleware({ app, path: "/graphql" }); //Applied the Apollo Server middleware to the Express App

    app.use((err, req, res, next) => {
      // console.log("here");
      // console.error(err);
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`GraphQL endpoint: ${server.graphqlPath}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer().catch((error) => console.error("Error starting server:", error));

module.exports = startServer;
