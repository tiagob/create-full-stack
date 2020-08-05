This project was bootstrapped with [Create Full Stack](https://github.com/tiagob/create-full-stack).

## Run

```bash
yarn start
```

Spins up postgres in Docker, the Hasura server and all clients.

<!-- @remove-pulumi-aws-begin -->

## Deploy

### Development

```bash
cd packages/pulumi-aws
pulumi stack select development
pulumi up
```

This sets up Auth0 which is required for authentication locally.

### Production

```bash
cd packages/pulumi-aws
pulumi stack select production
pulumi up
```

<!-- @remove-pulumi-aws-end -->

## Setup

_Assumes MacOS_

### Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

### Install Docker

```bash
brew cask install docker
```

References

- https://stackoverflow.com/a/43365425/709040
- https://docs.docker.com/get-docker/

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

### Install AWS CLI

```bash
brew install awscli
```

If you're new AWS, register at https://portal.aws.amazon.com/billing/signup#/start. Then, if you don't have an access key, create a new one. From https://console.aws.amazon.com/iam/home#/security_credentials goto Access Keys > Create New Access Key

Configure by adding your access key ID and secret access key (Default region name and output format are not required).

```bash
aws configure
```

References

- https://www.pulumi.com/docs/intro/cloud-providers/aws/setup/#using-the-cli

### Register domain on AWS Route53

<!-- @remove-web-begin -->

Pulumi web configuration requires a custom domain for CloudFront and that it's registered on Route53.

<!-- @remove-web-end -->

The backend uses the custom domain with a subdomain.

If you don't have a domain, register one on https://console.aws.amazon.com/route53/home#DomainRegistration:

If you already have a domain on a different registrar, transfer to Route53 on https://console.aws.amazon.com/route53/home#DomainTransfer:

References

- https://awscli.amazonaws.com/v2/documentation/api/latest/reference/route53domains/register-domain.html

### Configure Pulumi production stack

The domain must be registered in your AWS Route53. Other values can be arbitrarily chosen with some [AWS restrictions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html#RDS_Limits.Constraints).

```bash
cd packages/pulumi-aws
pulumi stack select production
pulumi config set domain [YOUR ROUTE53 DOMAIN]
pulumi config set dbName [YOUR POSTGRES DB NAME]
pulumi config set dbUsername [YOUR POSTGRES DB USERNAME]
pulumi config set dbPassword [YOUR POSTGRES DB PASSWORD] --secret
pulumi config set hasuraGraphqlAdminSecret [YOUR HASURA GRAPHQL ADMIN SECRET] --secret
```

<!-- @remove-pulumi-aws-end -->
