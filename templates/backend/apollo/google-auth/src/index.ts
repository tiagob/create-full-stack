import {
  ApolloServer,
  AuthenticationError,
  ForbiddenError
} from "apollo-server-express";
import program from "commander";
import fetch from "node-fetch";
import cors from "cors";
import express from "express";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import { sequelize } from "./models";

program.option("-s, --sync-db", "Sync database").parse(process.argv);

const origin = "http://localhost:3000";
const host = "http://localhost:4000";

interface TokenInfo {
  user_id?: string;
}

const run = () => {
  if (program.syncDb) {
    sequelize.sync({ force: true });
  } else {
    const app = express();
    const corsOptions = {
      origin,
      credentials: true // <-- REQUIRED backend setting
    };
    app.use(cors(corsOptions));

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }) => {
        // Uncomment to skip authentication and authorization if in development and in the
        // GraphQL Playground
        // if (
        //   process.env.NODE_ENV !== "production" &&
        //   req.headers.referer === "http://localhost:4000/graphql"
        // ) {
        //   return;
        // }

        // Get the user token from the headers
        const authorization = req.headers.authorization || "";
        if (!authorization) {
          throw new AuthenticationError("must authenticate");
        }
        const accessToken = authorization.substr("Bearer ".length);
        // Get token info from google given the access token
        // https://stackoverflow.com/a/24646356/709040
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
        );
        const tokenInfo = (await response.json()) as TokenInfo;
        const uid = tokenInfo.user_id;
        if (!uid) {
          throw new ForbiddenError("not authorized");
        }
        return { user: { uid } };
      }
    });
    server.applyMiddleware({ app });

    app.listen(process.env.PORT || 4000, () => {
      console.log(`🚀  Server ready at ${host}${server.graphqlPath}`);
    });
  }
};

run();
