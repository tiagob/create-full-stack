---
id: cloud
title: Cloud
---

Cloud choices for Create Full Stack.

## AWS

This choice includes Pulumi with AWS at `packages/pulumi-aws/`.

[Pulumi](https://www.pulumi.com/) is an infrastructure as code (IAC) platform for defining your cloud resources in TypeScript. It's free for single users.

AWS accounts for over 30% of the market. It's by far the market leader with a 5+ year head start over Azure and GCP. Its services are the most battle tested and the community is massive.

Create Full Stack includes a custom Pulumi AWS library (`cfs-pulumi-aws`) so you don't have to worry about the AWS internals. It has components for AWS RDS (Postgres), Fargate (backend) and Cloud Front (web).

### Monthly cost of AWS

- EC2-ELB: ~\$16
- Relational Database Service (RDS): ~\$13
- EC2-Instances: ~\$8
- EC2 Container Service: ~\$8
- Other: ~\$2

Total: ~\$47

This assumes all the services are up for the whole month. If you spin it up then immediately tear it down, you're charged a very small fraction of this.
