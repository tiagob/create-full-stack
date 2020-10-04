<!-- @remove-pulumi-aws-begin -->

**Follow the steps below to deploy to AWS.**

<!-- @remove-mobile-begin -->

## {STEP_NUMBER}. Setup Expo

_Expo simplifies mobile development by removing XCode and Android studio dependencies._

If you're new to Expo, register (it's free) by running:

```bash
yarn expo register
```

OR login if you have an account

```bash
yarn expo login
```

<!-- @remove-mobile-end -->

## {STEP_NUMBER}. Setup Pulumi

_Pulumi defines AWS infrastructure as TypeScript code._

Install Pulumi from their [website](https://www.pulumi.com/docs/get-started/install/).

<!-- @remove-mac-begin -->

OR with [Homebrew](https://brew.sh/) run:

```bash
brew install pulumi
```

<!-- @remove-mac-end -->

If you're new to Pulumi, register on their [signup page](https://app.pulumi.com/signup). Pulumi is free. Then login.

```bash
pulumi login
```

## {STEP_NUMBER}. Configure the production stack

```bash
cd packages/pulumi-aws
pulumi stack init production
pulumi config set dbName myDatabaseName # YOUR POSTGRES DB NAME
pulumi config set dbUsername myDatabaseUsername # YOUR POSTGRES DB USERNAME
pulumi config set --secret dbPassword myDatabasePassword # YOUR POSTGRES DB PASSWORD
pulumi config set --secret hasuraGraphqlAdminSecret myHasuraAdminSecret # YOUR HASURA GRAPHQL ADMIN SECRET
<!-- @remove-mobile-begin -->
pulumi config set expo:username myExpoUsername # YOUR EXPO USERNAME
pulumi config set --secret expo:password myExpoPassword # YOUR EXPO PASSWORD
<!-- @remove-mobile-end -->
```

`dbName`, `dbUsername`, `dbPassword` and `hasuraGraphqlAdminSecret` are values you make up. `db` fields must adhere to [AWS RDS constraints](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html#RDS_Limits.Constraints). Learn more about the Hasura admin secret on [their docs](https://hasura.io/docs/1.0/graphql/core/deployment/graphql-engine-flags/config-examples.html#add-an-admin-secret).

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

**Safely save your access key ID and secret access key for the CI/CD step below**

<!-- @remove-github-actions-end -->

## {STEP_NUMBER}. Register your domain on AWS Route53

<!-- @remove-web-begin -->

_Pulumi web configuration requires a custom domain that is registered on Route53 for CloudFront._

<!-- @remove-web-end -->

_The backend uses the custom domain with a subdomain._

If you don't have a domain, register one on Route53 from the AWS console [domain registration page](https://console.aws.amazon.com/route53/home#DomainRegistration:).

If you already have a domain on a different registrar, transfer it to Route53 from the AWS console [domain transfer page](https://console.aws.amazon.com/route53/home#DomainTransfer:).

```bash
pulumi config set domain demo-full-stack.com # YOUR ROUTE53 DOMAIN
```

## {STEP_NUMBER}. Install the AWS Pulumi plugin

```bash
pulumi plugin install resource aws 3.2.1
```

## {STEP_NUMBER}. Deploy

```bash
pulumi up --yes
```

🎉 _Congrats! Your full stack is deployed on AWS and Auth0._

<!-- @remove-pulumi-aws-end -->
<!-- @remove-github-actions-begin -->

## {STEP_NUMBER}. CI/CD

**You must deploy the production stack from your local machine first before deploying from GitHub Actions or you'll encounter [pulumi/issues/2097](https://github.com/pulumi/pulumi/issues/2097)**

Create a Pulumi access token from the Pulumi [Access Tokens Page](https://app.pulumi.com/account/tokens).

<img alt="Pulumi Access Token" src="https://create-full-stack.com/img/readme/pulumi_access_token.png" width="512">

- Give it a description (ex. "github actions")

After your code is pushed to a GitHub repo, add the following secrets for the Actions under Settings > Secrets.

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `PULUMI_ACCESS_TOKEN`

<img alt="GitHub Secrets" src="https://create-full-stack.com/img/readme/github_secrets.png" width="512">

`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` come from the "Setup the AWS CLI" section above.

🎉 _That's it!_ Push to GitHub and you should see your CI/CD jobs running under "Actions".

<br/>
References

- Pulumi - [Configuring your Secrets](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#configuring-your-secrets)
- GitHub - [Creating and Storing Encrypted Secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets)

<!-- @remove-github-actions-end -->
