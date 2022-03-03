import express from "express";
import cors from "cors";
import { program } from "commander";
import jsonGraphqlExpress from "json-graphql-server";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer, gql } from "apollo-server-core";
import http from "http";
import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { readFileSync } from "fs";

const DEFAULT_PORT = 4000;

program
  .option("--static", "serves static data")
  .option("--fake", "generates random data (default)")
  .option(
    "--port <number>",
    `port on which to run the server (default: ${DEFAULT_PORT}`
  );

const useStaticData = (app) => {
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
  app.use("/graphql", jsonGraphqlExpress.default(data));
  app.use(cors());
  app.listen(port);
};

const useFakeData = async (app) => {
  /*const schema = await loadSchema("./schema.graphql", {
    loaders: [new GraphQLFileLoader()],
  });*/
  const typeDefs = gql(readFileSync("./schema.graphql").toString("utf-8"));
  const resolvers = {
    Query: {
      allPosts: () => {
        throw Error("Not yet implemented");
      },
    },
  };
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    mocks: true
  });
  await server.start();
  server.applyMiddleware({ app, cors: true });
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
};

program.parse();

const options = program.opts();
const port = options.port ? parseInt(options.port, 10) : DEFAULT_PORT;
const app = express();

if (options.static) {
  console.info('Using static data...')
  useStaticData(app);
} else {
  console.info('Using fake data...')
  await useFakeData(app);
}

console.info(
  `Server up and running at http://localhost:${port}/graphql`
);
