import { ApolloServer } from "apollo-server";
import program from "commander";
import * as dns from "dns";
import * as os from "os";

import typeDefs from "./graphql/schema";
import { sequelize } from "./models";
import resolvers from "./resolvers";

program.option("-s, --sync-db", "Sync database").parse(process.argv);

const run = () => {
  if (program.syncDb) {
    sequelize.sync({ force: true });
  } else {
    dns.lookup(os.hostname(), async (_, localIp) => {
      const server = new ApolloServer({ typeDefs, resolvers });

      const port = process.env.PORT || 4000;
      const { url } = await server.listen(port);
      // eslint-disable-next-line no-console
      console.log(`🚀  Server ready at ${url} and http://${localIp}:${port}/`);
    });
  }
};

run();
