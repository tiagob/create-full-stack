import { ApolloServer } from "apollo-server-express";
import program from "commander";
import cors from "cors";
import * as dns from "dns";
import express from "express";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import * as os from "os";

import typeDefs from "./graphql/schema";
import { sequelize } from "./models";
import resolvers, { DecodedJwt } from "./resolvers";

require("dotenv").config();

interface Request {
  req: { user: DecodedJwt };
}

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
    app.use(
      cors({
        origin,
        credentials: true,
      })
    );

    app.use(
      jwt({
        secret: jwksRsa.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
        }),

        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithm: ["RS256"],
      })
    );

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }: Request) => {
        const user = req.user || undefined;
        return { user };
      },
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
