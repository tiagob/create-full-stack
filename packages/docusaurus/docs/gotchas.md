---
id: gotchas
title: Gotchas
---

## EADDRINUSE, Address already in use

Kill all node processes.

```bash
killall node
```

## Hooks can only be called inside the body of a function component

React in both `packages/mobile/package.json` and `packages/web/package.json` need to be the same version since they're shared in Yarn Workspaces (unless you add [nohoist](https://yarnpkg.com/blog/2018/02/15/nohoist/)).

## Auth0 login hangs on Android virtual device

Must use Android 11. https://github.com/expo/expo/issues/9845
