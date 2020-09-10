# Run with a build context at the root of the project
# docker build -f packages/server/Dockerfile .
# Use a multi-stage build to reduce the final image size
# ~1GB -> ~400MB
# https://docs.docker.com/develop/develop-images/multistage-build/
FROM node:12-alpine as build

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY ./packages/server ./packages/server

RUN yarn install --pure-lockfile --non-interactive

RUN yarn --cwd packages/server build

FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY packages/server/package.json packages/server/
COPY packages/server/ormconfig.js packages/server/
COPY packages/server/.env* packages/server/

COPY --from=build /usr/src/app/packages/server/build /usr/src/app/packages/server/build

ENV NODE_ENV production

RUN yarn install --pure-lockfile --non-interactive --production

WORKDIR /usr/src/app/packages/server

EXPOSE 8080
CMD ["yarn", "start-production"]
