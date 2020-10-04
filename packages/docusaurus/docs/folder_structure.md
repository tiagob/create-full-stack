---
id: folder_structure
title: Folder Structure
---

After creation, your project should look something like this:

```bash
hasura/  # If hasura backend is selected
packages/
  common/
  mobile/  # If mobile is included
  pulumi-aws/  # If pulumi aws cloud is selected
  server/  # If apollo-server-express backend is selected
  web/  # If web is included
```

`common/` contains shared mobile and web code. Any updates to common must first be built before used in `mobile/` or `web/`.

```bash
cd packages/common
yarn build
# Or to constantly check for updates
yarn watch
```

If changes are made to any `.graphql` files you must update the TS types and React hooks.

```bash
yarn generate
# Or to constantly check for updates
yarn generate --watch
```

`mobile/` and `web/` share a similar folder structure.

```bash
src/
  components/
  containers/
  utils/
```

`containers/` includes React routes or React Native navigation screens. `components/` includes any other react components used in the containers. If components are container specific, it's preferred to include them in the container itself. `utils/` includes common TS utility functions.
