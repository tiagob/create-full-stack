---
id: why
title: Why?
---

## Problem

As a developer you want to focus on building your application. Delighting your users! You don’t want to think about configurations and fitting libraries and frameworks together. You want something to get started today that you won’t have to rewrite tomorrow.

## Solution

Don't start from scratch, use CFS instead!

- Guard rails
  - Static type checking from DB to UX and back
    - API layer is type checked with GraphQL
  - Strict linting and code formatting without sacrificing velocity
    - Almost everything is autofix on save in VSCode
- Single language and tool chain
  - No context switching between different languages and build tools
- Pre-configured cloud setup
  - No need to mess around with AWS/Azure/GCP
    - Pulumi IAC ensures your full stack is cloud production ready with one deploy command
  - CI/CD
    - No 💩 gets checked in
    - Pushes to master automatically update infra and deploy your full stack
- Best tools in class
  - Every [library and framework](/docs/libraries_and_frameworks) has a large community
  - Ensures fewer edge cases and better support
