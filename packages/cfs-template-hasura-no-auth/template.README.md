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

Must begin with a letter and contain only alphanumeric characters.

##### `dbUsername`

1 to 16 alphanumeric characters. First character must be a letter

##### `dbPassword`

At least 8 printable ASCII characters. Can't contain any of the following: / (slash), '(single quote), "(double quote) and @ (at sign).

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

#### Deploy

```bash
pulumi up
```

This creates resources in your AWS account.

<!-- @remove-pulumi-aws-end -->
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
