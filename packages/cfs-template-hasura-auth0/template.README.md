This project was bootstrapped with [Create Full Stack](https://github.com/tiagob/create-full-stack).

## Setup

_Assumes MacOS_

### Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

### Install and start Docker

```bash
brew cask install docker
open /Applications/Docker.app
```

Alternatively, you can install via the GUI at https://docs.docker.com/get-docker/

<!-- @remove-mobile-begin -->

### Install and configure Expo CLI

```bash
yarn global add expo-cli
```

If you're new to Expo, register. Expo is free.

```bash
expo register
```

Or login if you have an account

```bash
expo login
```

References

- https://docs.expo.io/workflow/expo-cli/

<!-- @remove-mobile-end -->
<!-- @remove-pulumi-aws-begin -->

### Install and configure Pulumi CLI

```bash
brew install pulumi
```

If you're new to Pulumi, register at https://app.pulumi.com/signup. Pulumi is free. Then login.

```bash
pulumi login
```

References

- https://www.pulumi.com/docs/get-started/install/

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

![Auth0 Create Application](https://create-full-stack.com/img/readme/auth0_create_application.png)

- Give it a name (ex. "pulumi")
- Select "Machine to Machine Applications"

![Auth0 Machine to Machine](https://create-full-stack.com/img/readme/auth0_m2m.png)

- Select the "Auth0 Management API" under "Select an API..." dropdown
- Select "All" scopes

![Auth0 Machine to Machine Scopes](https://create-full-stack.com/img/readme/auth0_m2m_scopes.png)

Use the created Machine to Machine Application to set the pulumi configuration

![Auth0 Machine to Machine Settings](https://create-full-stack.com/img/readme/auth0_m2m_settings.png)

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
pulumi config set --secret hasuraGraphqlAdminSecret [YOUR HASURA GRAPHQL ADMIN SECRET]
<!-- @remove-mobile-begin -->
pulumi config set expo:username [YOUR EXPO USERNAME]
pulumi config set --secret expo:password [YOUR EXPO PASSWORD]
<!-- @remove-mobile-end -->
```

`dbName`, `dbUsername`, `dbPassword` and `hasuraGraphqlAdminSecret` are values you make up. `db` fields must adhere to [AWS RDS constraints](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html#RDS_Limits.Constraints). Learn more about the Hasura admin secret on [their docs](https://hasura.io/docs/1.0/graphql/core/deployment/graphql-engine-flags/config-examples.html#add-an-admin-secret).

##### `dbName`

The name must be unique across all DB instances owned by your AWS account in the current AWS Region. The DB instance identifier is case-insensitive, but is stored as all lowercase (as in "mydbinstance"). Constraints: 1 to 60 alphanumeric characters or hyphens (1 to 15 for SQL Server). First character must be a letter. Can't contain two consecutive hyphens. Can't end with a hyphen.

##### `dbUsername`

1 to 16 alphanumeric characters. First character must be a letter

##### `dbPassword`

Constraints: At least 8 printable ASCII characters. Can't contain any of the following: / (slash), '(single quote), "(double quote) and @ (at sign).

#### Install AWS CLI

```bash
brew install awscli
```

If you're new to AWS, register at https://portal.aws.amazon.com/billing/signup#/start. Then, if you don't have an access key, create a new one. From https://console.aws.amazon.com/iam/home#/security_credentials goto Access Keys > Create New Access Key.

![AWS Access Key](https://create-full-stack.com/img/readme/aws_access_key.png)

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

![Auth0 Tenant](https://create-full-stack.com/img/readme/auth0_tenant.png)

In your production Auth0 tenant create a Machine to Machine Application

- Applications > CREATE APPLICATION

![Auth0 Create Application](https://create-full-stack.com/img/readme/auth0_create_application.png)

- Give it a name (ex. "pulumi")
- Select "Machine to Machine Applications"

![Auth0 Machine to Machine](https://create-full-stack.com/img/readme/auth0_m2m.png)

- Select the "Auth0 Management API" under "Select an API..." dropdown
- Select "All" scopes

![Auth0 Machine to Machine Scopes](https://create-full-stack.com/img/readme/auth0_m2m_scopes.png)

Use the created Machine to Machine Application to set the pulumi configuration

![Auth0 Machine to Machine Settings](https://create-full-stack.com/img/readme/auth0_m2m_settings.png)

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

![Auth0 Signup](https://create-full-stack.com/img/readme/auth0_signup.png)

#### Auth0 Rule

Create an Auth0 Rule to add the custom JWT claims.

- Rules > CREATE RULE

![Auth0 Create Rule](https://create-full-stack.com/img/readme/auth0_create_rule.png)

- Select the "Empty rule" template

![Auth0 Rule Select](https://create-full-stack.com/img/readme/auth0_rule_select.png)

- Name the rule (ex. "hasura custom JWT claims")
- Paste the code snippet below into the "Script" section

```js
function hasuraAccessToken(user, context, callback) {
  const namespace = "https://hasura.io/jwt/claims";
  context.accessToken[namespace] = {
    "x-hasura-default-role": "user",
    "x-hasura-allowed-roles": ["user"],
    "x-hasura-user-id": user.user_id,
  };
  callback(undefined, user, context);
}
```

![Auth0 Rule](https://create-full-stack.com/img/readme/auth0_rule.png)

#### Server

Create an Auth0 API for the Apollo server

- APIs > CREATE API

![Auth0 Create API](https://create-full-stack.com/img/readme/auth0_create_api.png)

- Set the name (ex. "server").
- Record the identifier/audience.

![Auth0 API](https://create-full-stack.com/img/readme/auth0_api_settings.png)

In [`hasura/.env.development`](hasura/.env.development) fill in the field

```
HASURA_GRAPHQL_JWT_SECRET={"jwk_url":"https://[YOUR AUTH0 TENANT DOMAIN]/.well-known/jwks.json","audience":"[YOUR AUTH0 API AUDIENCE]"}
```

**Record your API audience for steps below**

<!-- @remove-web-begin -->

#### Web

Create a Single Page Application for the React website

- Applications > CREATE APPLICATION

![Auth0 Create Application](https://create-full-stack.com/img/readme/auth0_create_application.png)

- Set the name (ex. "web")
- Select "Single Page Web Applications"

![Auth0 Single Page Web App](https://create-full-stack.com/img/readme/auth0_spa.png)

- Under "Settings" set "Allowed Callback URLs", "Allowed Logout URLs", and "Allowed Web Origins" to "http://localhost:3000"

![Auth0 Single Page Web App URLs](https://create-full-stack.com/img/readme/auth0_spa_urls.png)

In [`packages/web/.env.development`](packages/web/.env.development) fill in the fields from the server API you created above and your Single Page Web Application's "Settings" page.

![Auth0 Single Page Web App URLs](https://create-full-stack.com/img/readme/auth0_spa_settings.png)

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

![Auth0 Create Application](https://create-full-stack.com/img/readme/auth0_create_application.png)

- Set the name (ex. "mobile")
- Select "Native"

![Auth0 Native](https://create-full-stack.com/img/readme/auth0_native.png)

- Set "Allowed Callback URLs" to "https://auth.expo.io/@[YOUR EXPO USERNAME]/[YOUR EXPO APP SLUG]"
  - Get YOUR EXPO USERNAME by running `expo whoami`
  - Get YOUR EXPO APP SLUG from [`packages/mobile/app.json`](packages/mobile/app.json) `"slug"`

![Auth0 Native Application URLs](https://create-full-stack.com/img/readme/auth0_native_urls.png)

In [`packages/mobile/.env.development`](packages/mobile/.env.development) fill in the fields from the server API you created above and your Native Application's "Settings" page.

![Auth0 Native Application Settings](https://create-full-stack.com/img/readme/auth0_native_settings.png)

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

![Auth0 Universal Login](https://create-full-stack.com/img/readme/auth0_universal_login.png)

#### Start

From the root of the project run

```bash
yarn start
```

<!-- @remove-manual-config-end -->
<!-- @remove-github-actions-begin -->

### CI/CD

Create a Pulumi access token from the Pulumi [Access Tokens Page](https://app.pulumi.com/account/tokens).

![Pulumi Access Token](https://create-full-stack.com/img/readme/pulumi_access_token.png)

- Give it a description (ex. "github actions")

After your code is pushed to a GitHub repo, add the following secrets for the Actions under Settings > Secrets.

- `PULUMI_ACCESS_TOKEN`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

![GitHub Secrets](https://create-full-stack.com/img/readme/github_secrets.png)

`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` come from the "Install AWS CLI" section above.

That's it! Push to GitHub and you should see your CI/CD jobs running under "Actions".

References

- https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#configuring-your-secrets
- https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets

<!-- @remove-github-actions-end -->
