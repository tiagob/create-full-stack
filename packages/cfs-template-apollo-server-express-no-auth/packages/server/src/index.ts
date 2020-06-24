import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import * as dns from "dns";
import express from "express";
import * as os from "os";

import typeDefs from "./graphql/schema";
import { sequelize } from "./models";
import resolvers from "./resolvers";

const origin = process.env.CORS_ORIGIN || "http://localhost:3000";

async function run() {
  try {
    await sequelize.authenticate();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Can't connect to the database.\n", error);
  }
  sequelize.sync();
  const app = express();
  app.use(cors({ origin }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  server.applyMiddleware({ app });

  dns.lookup(os.hostname(), async (_, localIp) => {
    const port = process.env.PORT || 8080;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(
      `🚀  Server ready at http://localhost:${port}/graphql and http://${localIp}:${port}/graphql`
    );
  });
}

run();
