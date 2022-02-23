import express from "express";
import cors from "cors";
import jsonGraphqlExpress from "json-graphql-server";

const port = 4000;
const app = express();

const data = {
  posts: [
    { id: 1, title: "Lorem Ipsum", views: 254, user_id: 123 },
    { id: 2, title: "Sic Dolor amet", views: 65, user_id: 456 },
  ],
  users: [
    { id: 123, name: "John Doe" },
    { id: 456, name: "Jane Doe" },
  ],
};

app.use(cors())
app.use("/graphql", jsonGraphqlExpress.default(data));
app.listen(port);

console.info(
  `Server up and running. Go to http://localhost:${port}/graphql to open up GraphiQL or use it as GraphQL endpoint`
);
