import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
/*import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";*/

const app = express();

app.use(express.json());

// Mount the GraphQL endpoint
app.use(
  "/graphql",
  createHandler({
    schema: buildSchema(`
      type Query {
        hello: String
      }
    `),
    rootValue: {
      hello: () => "Hello, world!",
    },
    graphiql: true,
  })
);

// Mount the API routes
/*app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);*/

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
