🎉 Create Full Stack has finished:

- Scaffolding your monorepo with your platform and feature selections
- Installing packages
- Generating configuration instructions based on your selection

**Follow the steps below to run locally.**

## {STEP_NUMBER}. Setup Docker

Docker runs the Postgres DB.

- Install Docker from their [website](https://docs.docker.com/get-docker/)
- Open the Docker app

<!-- @remove-mac-begin -->

OR with [Homebrew](https://brew.sh/) run:

```bash
brew cask install docker
open /Applications/Docker.app
```

<!-- @remove-mac-end -->

## {STEP_NUMBER}. Start

🎉 Congrats! Your full stack is configured and ready for development.

From the root of the project run:

```bash
yarn start
```

URLs available:

<!-- @remove-web-begin -->

- web: [http://localhost:3000](http://localhost:3000)
  <!-- @remove-web-end -->
  <!-- @remove-mobile-begin -->
- mobile (expo devtools): [http://localhost:19002](http://localhost:19002)
  <!-- @remove-mobile-end -->
- backend: [http://localhost:8080/v1/graphql](http://localhost:8080/v1/graphql)

## {STEP_NUMBER}. Access the Hasura console

With the Hasura backend up, run:

```bash
cd hasura/
yarn hasura console
```

Learn more about Hasura from their [docs](https://hasura.io/docs/1.0/graphql/core/index.html).

## {STEP_NUMBER}. What's next

- Check out [Available Scripts](https://create-full-stack.com/docs/available_scripts)
<!-- @remove-pulumi-aws-begin -->
- Deploy to AWS with the [production guide](PRODUCTION.md)
<!-- @remove-pulumi-aws-end -->
