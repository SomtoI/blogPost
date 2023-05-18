/*
import express from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import typeDefs from "./schema";
import resolvers from "./schema/resolvers";

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

server.applyMiddleware({ app, path: "/graphql" });

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database.");
    app.listen({ port: 4000 }, () =>
      console.log(
        "Server running at http://localhost:4000${server.graphqlPath}"
      )
    );
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
*/

import express from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import typeDefs from "./schema.js";
import resolvers from "./resolvers/index.js";
import { User, Post, Comment } from "./models/index.js";
import { authenticateUser } from "./utils/authMiddleware.js";
import { seedDatabase } from "./seed.js";
import sequelize from "./config/db.config.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Extract the authenticated user from the request
    const user = authenticateUser(req);
    return { user };
  },
});

await server.start();

server.applyMiddleware({ app });

const PORT = process.env.PORT || 4000;
const models = { User, Post, Comment };
/*
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

models.sequelize
  .sync()
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
