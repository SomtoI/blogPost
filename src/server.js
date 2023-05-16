import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const app = express();

app.use(express.json());

// Mount the GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
