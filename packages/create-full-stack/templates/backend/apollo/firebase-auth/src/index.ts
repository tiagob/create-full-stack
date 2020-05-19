import {
  ApolloServer,
  AuthenticationError,
  ForbiddenError,
} from "apollo-server-express";
import program from "commander";
import cors from "cors";
import express from "express";

import { sequelize } from "./models";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import admin from "./utils/firebaseAdmin";

program.option("-s, --sync-db", "Sync database").parse(process.argv);

const origin = "http://localhost:3000";
const host = "http://localhost:4000";

interface Context {
  user: admin.auth.UserRecord;
}

const run = (): void => {
  if (program.syncDb) {
    sequelize.sync({ force: true });
  } else {
    const app = express();
    const corsOptions = {
      origin,
      credentials: true,
    };
    app.use(cors(corsOptions));

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }): Promise<Context> => {
        // Get the user token from the headers
        const token = req.headers.authorization || "";
        if (!token) {
          throw new AuthenticationError("must authenticate");
        }

        let decodedToken: admin.auth.DecodedIdToken;
        try {
          decodedToken = await admin
            .auth()
            .verifyIdToken(token.slice("Bearer ".length));
        } catch (error) {
          throw new ForbiddenError("not authorized");
        }
        const user = await admin.auth().getUser(decodedToken.uid);
        return { user };
      },
    });
    server.applyMiddleware({ app });

    app.listen(process.env.PORT || 4000, () => {
      console.log(`🚀  Server ready at ${host}${server.graphqlPath}`);
    });
  }
};

run();
