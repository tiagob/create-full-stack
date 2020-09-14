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

```bash
brew install awscli
```

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
