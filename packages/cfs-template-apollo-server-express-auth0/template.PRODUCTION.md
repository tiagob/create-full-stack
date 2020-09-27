<!-- @remove-pulumi-aws-begin -->

**Follow the steps below to deploy to AWS.**

## {STEP_NUMBER}. Configure the production stack

```bash
cd packages/pulumi-aws
pulumi stack init production
pulumi config set dbName myDatabaseName # YOUR POSTGRES DB NAME
pulumi config set dbUsername myDatabaseUsername # YOUR POSTGRES DB USERNAME
pulumi config set --secret dbPassword myDatabasePassword # YOUR POSTGRES DB PASSWORD
<!-- @remove-mobile-begin -->
pulumi config set expo:username myExpoUsername # YOUR EXPO USERNAME
pulumi config set --secret expo:password myExpoPassword # YOUR EXPO PASSWORD
<!-- @remove-mobile-end -->
```

`dbName`, `dbUsername` and `dbPassword` are values you make up. They must adhere to [AWS RDS constraints](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html#RDS_Limits.Constraints).

#### `dbName`

Must begin with a letter and contain only alphanumeric characters.

#### `dbUsername`

1 to 16 alphanumeric characters. First character must be a letter.

#### `dbPassword`

At least 8 printable ASCII characters. Can't contain any of the following: / (slash), '(single quote), "(double quote) and @ (at sign).

## {STEP_NUMBER}. Setup the AWS CLI

Follow instructions on the [AWS CLI install guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

<!-- @remove-mac-begin -->

OR with [Homebrew](https://brew.sh/) run:

```bash
brew install awscli
```

<!-- @remove-mac-end -->

If you're new to AWS, register on their [signup page](https://portal.aws.amazon.com/billing/signup#/start). Then, if you don't have an access key, create a new one. From the [AWS console security credentials page](https://console.aws.amazon.com/iam/home#/security_credentials) goto:

- Access keys > Create New Access Key.

<img alt="AWS Access Key" src="https://create-full-stack.com/img/readme/aws_access_key.png" width="512">

Configure the AWS CLI by inputting your access key ID and secret access key. Default region name and output format are not required.

```bash
aws configure
```

<!-- @remove-github-actions-begin -->

**Safely record your access key ID and secret access key for the CI/CD step below**

<!-- @remove-github-actions-end -->

## {STEP_NUMBER}. Register your domain on AWS Route53

<!-- @remove-web-begin -->

Pulumi web configuration requires a custom domain that is registered on Route53 for CloudFront.

<!-- @remove-web-end -->

The backend uses the custom domain with a subdomain.

If you don't have a domain, register a domain on Route53 from the [AWS console](https://console.aws.amazon.com/route53/home#DomainRegistration:).

If you already have a domain on a different registrar, transfer your domain to Route53 from the [AWS console](https://console.aws.amazon.com/route53/home#DomainTransfer:).

```bash
pulumi config set domain demo-full-stack.com # YOUR ROUTE53 DOMAIN
```

## {STEP_NUMBER}. Configure Auth0

Create a new [Auth0 tenant](https://auth0.com/docs/getting-started/the-basics#account-and-tenants) for production. The tenant name is publicly viewable in the login url so make it readable (ex. "{APP_NAME}").

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

- Click "Settings"
- Use the created Machine to Machine Application to set the pulumi configuration

<img alt="Auth0 Machine to Machine Settings" src="https://create-full-stack.com/img/readme/auth0_m2m_settings.png" width="512">

```bash
pulumi config set auth0:domain demo-full-stack.us.auth0.com # YOUR AUTH0 TENANT DOMAIN
pulumi config set --secret auth0:clientId xxxxxxxxxxx # YOUR AUTH0 MACHINE TO MACHINE CLIENT ID
pulumi config set --secret auth0:clientSecret xxxxxxxxxxx # YOUR AUTH0 MACHINE TO MACHINE CLIENT SECRET
```

You can learn more on the [Auth0 docs](https://www.pulumi.com/docs/intro/cloud-providers/auth0/setup/#configuring-credentials).

## {STEP_NUMBER}. Install the AWS Pulumi plugin

```bash
pulumi plugin install resource aws 3.2.1
```

## {STEP_NUMBER}. Deploy

```bash
pulumi up --yes
```

🎉 Congrats! Your full stack is deployed on AWS and Auth0.

<!-- @remove-pulumi-aws-end -->
<!-- @remove-github-actions-begin -->

## {STEP_NUMBER}. CI/CD

**You must deploy the production stack from your local machine first before deploying from GitHub Actions or you'll encounter https://github.com/pulumi/pulumi/issues/2097**

Create a Pulumi access token from the Pulumi [Access Tokens Page](https://app.pulumi.com/account/tokens).

<img alt="Pulumi Access Token" src="https://create-full-stack.com/img/readme/pulumi_access_token.png" width="512">

- Give it a description (ex. "github actions")

After your code is pushed to a GitHub repo, add the following secrets for the Actions under Settings > Secrets.

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `PULUMI_ACCESS_TOKEN`

<img alt="GitHub Secrets" src="https://create-full-stack.com/img/readme/github_secrets.png" width="512">

`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` come from the "Setup the AWS CLI" section above.

🎉 That's it! Push to GitHub and you should see your CI/CD jobs running under "Actions".

<br/>
References

- Pulumi - [Configuring your Secrets](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#configuring-your-secrets)
- GitHub - [Creating and Storing Encrypted Secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets)

<!-- @remove-github-actions-end -->
