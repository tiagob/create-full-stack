---
id: cicd
title: CI/CD
---

If included, Create Full Stack includes configuration for continuous integration (CI) and continuous deployment (CD) through [GitHub Actions](https://docs.github.com/en/actions) at `.github/workflows/`.

For CI, Create Full Stack runs tests on all platforms (server, web, mobile) on any push to GitHub.

For CD, Create Full Stack deploys changes automatically using Pulumi on any push to master.

In addition, Create Full Stack previews changes to AWS infra for any new pull request.
