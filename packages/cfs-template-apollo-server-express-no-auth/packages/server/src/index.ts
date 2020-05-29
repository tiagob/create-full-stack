import { ApolloServer } from "apollo-server-express";
import program from "commander";
import cors from "cors";
import * as dns from "dns";
import express from "express";
import * as os from "os";

import typeDefs from "./graphql/schema";
import { sequelize } from "./models";
import resolvers from "./resolvers";

program.option("-s, --sync-db", "Sync database").parse(process.argv);

const origin = "http://localhost:3000";

async function run() {
  if (program.syncDb) {
    sequelize.sync({ force: true });
  } else {
    try {
      await sequelize.authenticate();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Can't connect to the database.\n", error);
    }
    const app = express();
    app.use(cors({ origin }));

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });
    server.applyMiddleware({ app });

    dns.lookup(os.hostname(), async (_, localIp) => {
      const port = process.env.PORT || 4000;
      await app.listen(port);
      // eslint-disable-next-line no-console
      console.log(
        `🚀  Server ready at http://localhost:${port}/graphql and http://${localIp}:${port}/graphql`
      );
    });
  }
}

run();
