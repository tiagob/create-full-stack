---
id: libraries_and_frameworks
title: Libraries and Frameworks
---

Included libraries and frameworks that Create Full Stack stitches together.

## Apollo

[![GitHub stars](https://img.shields.io/github/stars/apollographql/apollo-client.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/apollographql/apollo-client/stargazers/)

Industry-standard GraphQL implementation, providing the data graph layer that connects modern apps to the cloud. https://www.apollographql.com/

Provides an easy to use, feature-rich GraphQL client with great documentation.

Used for the frontend clients and/or server.

## Auth0

Authentication and user management as a service. One-click integrations with every auth provider. https://auth0.com/

Used for authentication.

## AWS

Providing on-demand cloud computing platforms and APIs to individuals, companies, and governments, on a metered pay-as-you-go basis. https://aws.amazon.com/

AWS had >5 year head start over Azure and GCP. It holds the largest market share and continues to innovate quickly.

Used for the cloud infrastructure.

## Create React App

[![GitHub stars](https://img.shields.io/github/stars/facebook/create-react-app.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/facebook/create-react-app/stargazers/)

Create React App is an officially supported way to create single-page React applications. It offers a modern build setup with no configuration. https://create-react-app.dev/docs/getting-started/

CRA remains the most popular choice for React development. Newer alternatives, like Next.js and Gatsby, use SSR or static site generation. Neither of these approaches perform well with dynamic React sites. Many websites at the forefront of web development use client side React rendering including the makers of React (Facebook). CRA provides the best user experience for this pattern.

Used for the web application.

## Expo

[![GitHub stars](https://img.shields.io/github/stars/expo/expo.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/expo/expo/stargazers/)

A framework and a platform for universal React applications. It is a set of tools and services built around React Native and native platforms that help you develop, build, deploy, and quickly iterate on iOS, Android, and web apps from the same JavaScript/TypeScript codebase. https://docs.expo.io/

Expo removes the dependency on XCode and Android Studio for React Native development. It also enables code pushes without the need to go through the app store for updates. This comes at a cost of a larger bundle size and limited React Native module support. Like CRA, you can eject if these limitations are too significant.

Used for the mobile application.

## GraphQL

[![GitHub stars](https://img.shields.io/github/stars/graphql/graphql-js.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/graphql/graphql-js/stargazers/)

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools. https://graphql.org/

Makes queries a breeze and prevents one-off solutions you often see in the REST world. A statically typed API layer in a mono-repo ensures platforms are always in sync so services are guaranteed the data they request.

Used for the API layer.

## GraphQL Generator

[![GitHub stars](https://img.shields.io/github/stars/dotansimha/graphql-code-generator.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/dotansimha/graphql-code-generator/stargazers/)

Generate code from your GraphQL schema and operations with a simple CLI. https://graphql-code-generator.com/

Used for TypeScript type and React hook Apollo client generation.

## Hasura

[![GitHub stars](https://img.shields.io/github/stars/hasura/graphql-engine.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/hasura/graphql-engine/stargazers/)

Connects to your databases & services and gives you a realtime GraphQL API, instantly. https://hasura.io/opensource/

Hasura offers a backend as a service similar to Firebase or AWS App Sync. However, Hasura runs on top of Postgres, provides clear authorization tweaking and convenient business logic hooks. Postgres guarantees data integrity in a way that Firestore (Firebase) or Dynamo DB (AWS App Sync) can never match.

Used for the server/backend.

## Jest

[![GitHub stars](https://img.shields.io/github/stars/facebook/jest.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/facebook/jest/stargazers/)

A delightful JavaScript Testing Framework with a focus on simplicity. https://jestjs.io/

Used for testing along with [ts-jest](https://kulshekhar.github.io/ts-jest/).

## Material UI

[![GitHub stars](https://img.shields.io/github/stars/mui-org/material-ui.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/mui-org/material-ui/stargazers/)

React components for faster and easier web development. Build your own design system, or start with Material Design. https://material-ui.com/

The leading React web component library. Easy to extend. Fantastic documentation.

Used for web UI components.

## Pulumi

[![GitHub stars](https://img.shields.io/github/stars/pulumi/pulumi.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/pulumi/pulumi/stargazers/)

Create, deploy, and manage infrastructure on any cloud using familiar programming languages and tools. https://www.pulumi.com/

Currently Pulumi is the only multi-cloud production ready TypeScript solution for infrastructure as code. Alternatives are [cdktf](https://learn.hashicorp.com/tutorials/terraform/cdktf?in=terraform/cdktf) and [AWS CDK](https://aws.amazon.com/cdk/). cdktf is in Beta and doesn't yet support multi stack (https://github.com/hashicorp/terraform-cdk/issues/35). AWS CDK is limited to AWS.

Used for infrastructure-as-code.

## React

[![GitHub stars](https://img.shields.io/github/stars/facebook/react.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/facebook/react/stargazers/)

A JavaScript library for building user interfaces. https://reactjs.org/

React is the industry leading solution for web UI development with nearly every major dynamic site using it. JSX provides a declarative way of defining updates that simplifies the complexity of state managing changes.

Used for the web application.

## React Native

[![GitHub stars](https://img.shields.io/github/stars/facebook/react-native.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/facebook/react-native/stargazers/)

Create native apps for Android and iOS using React. https://reactnative.dev/

Instead of using Swift, Kotlin, Objective C or Java write mobile apps with the same tools used for web. This enables code sharing with less complexity given fewer tools.

Used for the mobile application.

## React Native Elements

[![GitHub stars](https://img.shields.io/github/stars/react-native-elements/react-native-elements.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/react-native-elements/react-native-elements/stargazers/)

A cross platform React Native ui toolkit. https://react-native-elements.github.io/react-native-elements/

The leading React Native component library.

Used for mobile UI components.

## TypeORM

[![GitHub stars](https://img.shields.io/github/stars/typeorm/typeorm.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/typeorm/typeorm/stargazers/)

A TypeScript ORM for NodeJS and Postgres. https://typeorm.io/#/

Used for connecting Apollo Server Express to Postgres.
