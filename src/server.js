import express from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";

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
