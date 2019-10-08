import {
  ApolloServer,
  ForbiddenError,
  AuthenticationError
} from "apollo-server-express";
import program from "commander";

import resolvers from "./resolvers";
import typeDefs from "./schema";
import { sequelize } from "./models";
import admin from "./utils/firebaseAdmin";
import cors from "cors";
import express from "express";

program.option("-s, --sync-db", "Sync database").parse(process.argv);

const origin = "http://localhost:3000";
const host = "http://localhost:4000";

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
        const token = req.headers.authorization || "";
        if (!token) {
          throw new AuthenticationError("must authenticate");
        }

        let decodedToken: admin.auth.DecodedIdToken;
        try {
          decodedToken = await admin
            .auth()
            .verifyIdToken(token.substr("Bearer ".length));
        } catch (error) {
          throw new ForbiddenError("not authorized");
        }
        const user = await admin.auth().getUser(decodedToken.uid);
        return { user };
      }
    });
    server.applyMiddleware({ app });

    app.listen(process.env.PORT || 4000, () => {
      console.log(`🚀  Server ready at ${host}${server.graphqlPath}`);
    });
  }
};

run();
