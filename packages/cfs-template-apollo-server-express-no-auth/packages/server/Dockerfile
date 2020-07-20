# Run with a build context at the root of the project
# docker build -f packages/server/Dockerfile .
FROM node:12-alpine as build

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY ./packages/server ./packages/server

RUN yarn install --pure-lockfile --non-interactive

WORKDIR /usr/src/app/packages/server
RUN yarn build

FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

COPY --from=build /usr/src/app/packages/server/package.json /usr/src/app/packages/server/package.json
COPY --from=build /usr/src/app/packages/server/build /usr/src/app/packages/server/build

ENV NODE_ENV production

RUN yarn install --pure-lockfile --non-interactive --production

WORKDIR /usr/src/app/packages/server

EXPOSE 8080
CMD ["yarn", "start-production"]
