This project was bootstrapped with [Create Full Stack](https://github.com/tiagob/create-full-stack).

## Setup

### Install and start Docker

Follow instructions at https://docs.docker.com/get-docker/

<!-- @remove-mac-begin -->

Or with [Homebrew](https://brew.sh/) run:

```bash
brew cask install docker
open /Applications/Docker.app
```

<!-- @remove-mac-end -->
<!-- @remove-mobile-begin -->

### Install and configure Expo CLI

If you're new to Expo, register. Expo is free.

```bash
yarn expo register
```

Or login if you have an account

```bash
yarn expo login
```

References

- https://docs.expo.io/workflow/expo-cli/

<!-- @remove-mobile-end -->
<!-- @remove-pulumi-aws-begin -->

### Install and configure Pulumi CLI

Follow instructions at https://www.pulumi.com/docs/get-started/install/

<!-- @remove-mac-begin -->

Or with [Homebrew](https://brew.sh/) run:

```bash
brew install pulumi
```

<!-- @remove-mac-end -->

If you're new to Pulumi, register at https://app.pulumi.com/signup. Pulumi is free. Then login.

```bash
pulumi login
```

### Development stack

```bash
cd packages/pulumi-aws
pulumi stack init development
<!-- @remove-mobile-begin -->
pulumi config set expo:username [YOUR EXPO USERNAME]
<!-- @remove-mobile-end -->
```

<!-- @remove-mobile-begin -->

You can find your Expo username by running `expo whoami`.

<!-- @remove-mobile-end -->

#### Configure Auth0

[Signup](https://auth0.com/signup) and create an Auth0 development tenant (we'll later create a production tenant). Auth0 is free for up to 7k users.

In your development Auth0 tenant create a Machine to Machine Application.

- Applications > CREATE APPLICATION

<img alt="Auth0 Create Application" src="https://create-full-stack.com/img/readme/auth0_create_application.png" width="512">

- Give it a name (ex. "pulumi")
- Select "Machine to Machine Applications"

<img alt="Auth0 Machine to Machine" src="https://create-full-stack.com/img/readme/auth0_m2m.png" width="512">

- Select the "Auth0 Management API" under "Select an API..." dropdown
- Select "All" scopes

<img alt="Auth0 Machine to Machine Scopes" src="https://create-full-stack.com/img/readme/auth0_m2m_scopes.png" width="512">

Use the created Machine to Machine Application to set the pulumi configuration

<img alt="Auth0 Machine to Machine Settings" src="https://create-full-stack.com/img/readme/auth0_m2m_settings.png" width="512">

```bash
pulumi config set auth0:domain [YOUR AUTH0 TENANT DOMAIN]
pulumi config set --secret auth0:clientId [YOUR AUTH0 MACHINE TO MACHINE CLIENT ID]
pulumi config set --secret auth0:clientSecret [YOUR AUTH0 MACHINE TO MACHINE CLIENT SECRET]
```

References

- https://www.pulumi.com/docs/intro/cloud-providers/auth0/setup/#configuring-credentials

#### Deploy

```bash
pulumi up
```

This makes all the necessary changes to Auth0 and writes local `.env` files with the proper values. No secrets are stored in the `.env` files. Feel free to check them into source control.

#### Start

```bash
cd ../..  # Goto root
yarn start
```

### Production stack

```bash
cd packages/pulumi-aws
pulumi stack init production
pulumi config set dbName [YOUR POSTGRES DB NAME]
pulumi config set dbUsername [YOUR POSTGRES DB USERNAME]
pulumi config set --secret dbPassword [YOUR POSTGRES DB PASSWORD]
<!-- @remove-mobile-begin -->
pulumi config set expo:username [YOUR EXPO USERNAME]
pulumi config set --secret expo:password [YOUR EXPO PASSWORD]
<!-- @remove-mobile-end -->
```

`dbName`, `dbUsername` and `dbPassword` are values you make up. They must adhere to [AWS RDS constraints](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html#RDS_Limits.Constraints).

##### `dbName`

The name must be unique across all DB instances owned by your AWS account in the current AWS Region. The DB instance identifier is case-insensitive, but is stored as all lowercase (as in "mydbinstance"). Constraints: 1 to 60 alphanumeric characters or hyphens (1 to 15 for SQL Server). First character must be a letter. Can't contain two consecutive hyphens. Can't end with a hyphen.

##### `dbUsername`

1 to 16 alphanumeric characters. First character must be a letter

##### `dbPassword`

Constraints: At least 8 printable ASCII characters. Can't contain any of the following: / (slash), '(single quote), "(double quote) and @ (at sign).

#### Install AWS CLI

Follow instructions at https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

<!-- @remove-mac-begin -->

Or with [Homebrew](https://brew.sh/) run:

```bash
brew install awscli
```

<!-- @remove-mac-end -->

If you're new to AWS, register at https://portal.aws.amazon.com/billing/signup#/start. Then, if you don't have an access key, create a new one. From https://console.aws.amazon.com/iam/home#/security_credentials goto Access Keys > Create New Access Key.

<img alt="AWS Access Key" src="https://create-full-stack.com/img/readme/aws_access_key.png" width="512">

Configure the AWS CLI by inputting your access key ID and secret access key. Default region name and output format are not required.

```bash
aws configure
```

<!-- @remove-github-actions-begin -->

**Safely record your access key ID and secret access key for the CI/CD step below**

<!-- @remove-github-actions-end -->

References

- https://www.pulumi.com/docs/intro/cloud-providers/aws/setup/#using-the-cli

#### Register domain on AWS Route53

<!-- @remove-web-begin -->

Pulumi web configuration requires a custom domain for CloudFront and that it's registered on Route53.

<!-- @remove-web-end -->

The backend uses the custom domain with a subdomain.

If you don't have a domain, register one on https://console.aws.amazon.com/route53/home#DomainRegistration:

If you already have a domain on a different registrar, transfer to Route53 on https://console.aws.amazon.com/route53/home#DomainTransfer:

```bash
pulumi config set domain [YOUR ROUTE53 DOMAIN]
```

References

- https://awscli.amazonaws.com/v2/documentation/api/latest/reference/route53domains/register-domain.html

#### Configure Auth0

Create a new [Auth0 tenant](https://auth0.com/docs/getting-started/the-basics#account-and-tenants) for production.

<img alt="Auth0 Tenant" src="https://create-full-stack.com/img/readme/auth0_tenant.png" width="512">

In your production Auth0 tenant create a Machine to Machine Application

- Applications > CREATE APPLICATION

<img alt="Auth0 Create Application" src="https://create-full-stack.com/img/readme/auth0_create_application.png" width="512">

- Give it a name (ex. "pulumi")
- Select "Machine to Machine Applications"

<img alt="Auth0 Machine to Machine" src="https://create-full-stack.com/img/readme/auth0_m2m.png" width="512">

- Select the "Auth0 Management API" under "Select an API..." dropdown
- Select "All" scopes

<img alt="Auth0 Machine to Machine Scopes" src="https://create-full-stack.com/img/readme/auth0_m2m_scopes.png" width="512">

Use the created Machine to Machine Application to set the pulumi configuration

<img alt="Auth0 Machine to Machine Settings" src="https://create-full-stack.com/img/readme/auth0_m2m_settings.png" width="512">

```bash
pulumi config set auth0:domain [YOUR AUTH0 TENANT DOMAIN]
pulumi config set --secret auth0:clientId [YOUR AUTH0 MACHINE TO MACHINE CLIENT ID]
pulumi config set --secret auth0:clientSecret [YOUR AUTH0 MACHINE TO MACHINE CLIENT SECRET]
```

References

- https://www.pulumi.com/docs/intro/cloud-providers/auth0/setup/#configuring-credentials

#### Deploy

```bash
pulumi up
```

This creates resources in your Auth0 production tenant and on your AWS account.

<!-- @remove-pulumi-aws-end -->
<!-- @remove-manual-config-begin -->

### Configure Auth0

[Signup](https://auth0.com/signup) and create an Auth0 tenant. Auth0 is free for up to 7k users.

**Record your tenant domain for steps below**

<img alt="Auth0 Signup" src="https://create-full-stack.com/img/readme/auth0_signup.png" width="512">

#### Server

Create an Auth0 API for the Apollo server

- APIs > CREATE API

<img alt="Auth0 Create API" src="https://create-full-stack.com/img/readme/auth0_create_api.png" width="512">

- Set the name (ex. "server").
- Record the identifier/audience.

<img alt="Auth0 API" src="https://create-full-stack.com/img/readme/auth0_api_settings.png" width="512">

In [`packages/server/.env.development`](packages/server/.env.development) fill in the fields

```
AUTH0_AUDIENCE=[YOUR AUTH0 API AUDIENCE]
AUTH0_DOMAIN=[YOUR AUTH0 TENANT DOMAIN]
```

**Record your API audience for steps below**

<!-- @remove-web-begin -->

#### Web

Create a Single Page Application for the React website

- Applications > CREATE APPLICATION

<img alt="Auth0 Create Application" src="https://create-full-stack.com/img/readme/auth0_create_application.png" width="512">

- Set the name (ex. "web")
- Select "Single Page Web Applications"

<img alt="Auth0 Single Page Web App" src="https://create-full-stack.com/img/readme/auth0_spa.png" width="512">

- Under "Settings" set "Allowed Callback URLs", "Allowed Logout URLs", and "Allowed Web Origins" to "http://localhost:3000"

<img alt="Auth0 Single Page Web App URLs" src="https://create-full-stack.com/img/readme/auth0_spa_urls.png" width="512">

In [`packages/web/.env.development`](packages/web/.env.development) fill in the fields from the server API you created above and your Single Page Web Application's "Settings" page.

<img alt="Auth0 Single Page Web App URLs" src="https://create-full-stack.com/img/readme/auth0_spa_settings.png" width="512">

```
REACT_APP_AUTH0_AUDIENCE=[YOUR AUTH0 API AUDIENCE]
REACT_APP_AUTH0_DOMAIN=[YOUR AUTH0 TENANT DOMAIN]
REACT_APP_AUTH0_CLIENT_ID=[YOUR AUTH0 SINGLE PAGE APPLICATION CLIENT ID]
```

<!-- @remove-web-end -->
<!-- @remove-mobile-begin -->

#### Mobile

Create a Native Application for the React Native mobile app

- Applications > CREATE APPLICATION

<img alt="Auth0 Create Application" src="https://create-full-stack.com/img/readme/auth0_create_application.png" width="512">

- Set the name (ex. "mobile")
- Select "Native"

<img alt="Auth0 Native" src="https://create-full-stack.com/img/readme/auth0_native.png" width="512">

- Set "Allowed Callback URLs" to "https://auth.expo.io/@[YOUR EXPO USERNAME]/[YOUR EXPO APP SLUG]"
  - Get YOUR EXPO USERNAME by running `expo whoami`
  - Get YOUR EXPO APP SLUG from [`packages/mobile/app.json`](packages/mobile/app.json) `"slug"`

<img alt="Auth0 Native Application URLs" src="https://create-full-stack.com/img/readme/auth0_native_urls.png" width="512">

In [`packages/mobile/.env.development`](packages/mobile/.env.development) fill in the fields from the server API you created above and your Native Application's "Settings" page.

<img alt="Auth0 Native Application Settings" src="https://create-full-stack.com/img/readme/auth0_native_settings.png" width="512">

```
AUTH0_AUDIENCE=[YOUR AUTH0 API AUDIENCE]
AUTH0_DOMAIN=[YOUR AUTH0 DOMAIN]
AUTH0_CLIENT_ID=[YOUR AUTH0 NATIVE APPLICATION CLIENT ID]
```

<!-- @remove-mobile-end -->

#### Universal login

It's recommended you use the "New Universal Login Experience" which stores user credentials on page refresh. This is also helpful for developing so you don't need to re-authenticate to view changes you make.

- Navigate to "Universal Login"
- Switch from "Classic" to "New"

<img alt="Auth0 Universal Login" src="https://create-full-stack.com/img/readme/auth0_universal_login.png" width="512">

#### Start

From the root of the project run

```bash
yarn start
```

<!-- @remove-manual-config-end -->
<!-- @remove-github-actions-begin -->

### CI/CD

Create a Pulumi access token from the Pulumi [Access Tokens Page](https://app.pulumi.com/account/tokens).

<img alt="Pulumi Access Token" src="https://create-full-stack.com/img/readme/pulumi_access_token.png" width="512">

- Give it a description (ex. "github actions")

After your code is pushed to a GitHub repo, add the following secrets for the Actions under Settings > Secrets.

- `PULUMI_ACCESS_TOKEN`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

<img alt="GitHub Secrets" src="https://create-full-stack.com/img/readme/github_secrets.png" width="512">

`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` come from the "Install AWS CLI" section above.

That's it! Push to GitHub and you should see your CI/CD jobs running under "Actions".

References

- https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#configuring-your-secrets
- https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets

<!-- @remove-github-actions-end -->
