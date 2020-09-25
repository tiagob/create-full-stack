import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { Connection, createConnection, QueryFailedError } from "typeorm";

import getResolvers from "./getResolvers";
import typeDefs from "./graphql/schema";

const origin = process.env.CORS_ORIGIN || "http://localhost:3000";

async function run() {
  let connection: Connection;
  try {
    connection = await createConnection();
  } catch (error) {
    if (error instanceof QueryFailedError) {
      // eslint-disable-next-line no-console
      console.error(
        "Database is out of sync. To fix run `yarn typeorm schema:drop && yarn typeorm schema:sync`\n",
        "NOTE: This drops all data in the existing database.\n"
      );
    }
    throw error;
  }
  const resolvers = getResolvers(connection);

  const app = express();
  app.use(cors({ origin }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  server.applyMiddleware({ app });

  const port = process.env.PORT || 8080;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at http://localhost:${port}/graphql`);
}

run();
