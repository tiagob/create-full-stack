import { ApolloServer } from "apollo-server";
import program from "commander";
import * as dns from "dns";
import * as os from "os";

import { sequelize } from "./models";
import resolvers from "./resolvers";
import typeDefs from "./schema";

program.option("-s, --sync-db", "Sync database").parse(process.argv);

const run = (): void => {
  if (program.syncDb) {
    sequelize.sync({ force: true });
  } else {
    dns.lookup(os.hostname(), async (_, localIp) => {
      const server = new ApolloServer({ typeDefs, resolvers });

      const port = process.env.PORT || 4000;
      const { url } = await server.listen(port);
      console.log(`🚀  Server ready at ${url} and http://${localIp}:${port}/`);
    });
  }
};

run();
