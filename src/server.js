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

/*
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schema';
import resolvers from './resolvers';

dotenv.config();

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    // Verify and decode the JWT token
    // Set the authenticated user to the context
    // Example code:
    // try {
    //   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    //   const currentUser = await models.User.findByPk(decodedToken.id);
    //   return { currentUser };
    // } catch (error) {
    //   return { currentUser: null };
    // }
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 4000;

models.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
*/
