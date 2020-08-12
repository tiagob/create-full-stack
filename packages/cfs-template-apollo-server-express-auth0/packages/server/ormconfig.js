// Load configuration from .env files.
// Required for TypeORM CLI commands, `yarn typeorm`.
require("cfs-dotenv").config();

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: ["build/entity/**/*.js"],
  migrations: ["build/migration/**/*.js"],
  subscribers: ["build/subscriber/**/*.js"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
