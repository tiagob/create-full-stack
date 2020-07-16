import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Cluster } from "@pulumi/awsx/ecs";
import * as pulumi from "@pulumi/pulumi";

export interface RdsArgs {
  dbName: string;
  dbUsername: string;
  dbPassword: pulumi.Output<string>;
}

export default class Rds extends pulumi.ComponentResource {
  connectionString: pulumi.Output<string>;

  cluster: Cluster;

  constructor(name: string, args: RdsArgs, opts?: pulumi.ResourceOptions) {
    const { dbName, dbUsername, dbPassword } = args;
    super("aws:Rds", name, args, opts);

    // Get the default VPC and ECS Cluster for your account.
    const vpc = awsx.ec2.Vpc.getDefault();
    this.cluster = awsx.ecs.Cluster.getDefault();

    // Create a new subnet group for the database.
    const subnetGroup = new aws.rds.SubnetGroup(`${name}-subnet-group`, {
      subnetIds: vpc.publicSubnetIds,
    });

    // Create a new database, using the subnet and cluster groups.
    const db = new aws.rds.Instance(`${name}-instance`, {
      engine: "postgres",
      instanceClass: aws.rds.InstanceTypes.T3_Micro,
      allocatedStorage: 5,
      dbSubnetGroupName: subnetGroup.id,
      vpcSecurityGroupIds: this.cluster.securityGroups.map((g) => g.id),
      name: dbName,
      username: dbUsername,
      password: dbPassword,
      skipFinalSnapshot: true,
    });

    this.connectionString = pulumi.interpolate`postgres://${dbUsername}:${dbPassword}@${db.endpoint}/${dbName}?sslmode=disable`;

    this.registerOutputs({
      connectionString: this.connectionString,
      cluster: this.cluster,
    });
  }
}
