import { ApolloServer } from "apollo-server-express";
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

const origin = ["http://localhost:3000"];
if (process.env.CORS_ORIGIN) {
  origin.push(process.env.CORS_ORIGIN);
}

async function run() {
  try {
    await sequelize.authenticate();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Can't connect to the database.\n", error);
  }
  sequelize.sync();
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
    const port = process.env.PORT || 8080;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(
      `🚀  Server ready at http://localhost:${port}/graphql and http://${localIp}:${port}/graphql`
    );
  });
}

run();
