🎉 _Create Full Stack has finished:_

- _Scaffolding your monorepo with your platform and feature selections_
- _Installing packages_
- _Generating configuration instructions based on your selection_

**Follow the steps below to run locally.**

## {STEP_NUMBER}. Setup Docker

_Docker runs the Postgres DB._

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

🎉 _Congrats! Your full stack is configured and ready for development._

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
- backend: [http://localhost:8080/graphql](http://localhost:8080/graphql)

## {STEP_NUMBER}. What's next

- Check out [Available Scripts](https://create-full-stack.com/docs/available_scripts)
<!-- @remove-pulumi-aws-begin -->
- Deploy to AWS with the [production guide]({PRODUCTION_FILENAME})
<!-- @remove-pulumi-aws-end -->
