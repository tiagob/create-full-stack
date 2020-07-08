import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

export default function createRds(config: pulumi.Config) {
  const dbName = config.require("dbName");
  const dbUsername = config.require("dbUsername");
  const dbPassword = config.requireSecret("dbPassword");

  // Get the default VPC and ECS Cluster for your account.
  const vpc = awsx.ec2.Vpc.getDefault();
  const cluster = awsx.ecs.Cluster.getDefault();

  // Create a new subnet group for the database.
  const subnetGroup = new aws.rds.SubnetGroup("dbsubnets", {
    subnetIds: vpc.publicSubnetIds,
  });

  // Create a new database, using the subnet and cluster groups.
  const db = new aws.rds.Instance("db", {
    engine: "postgres",
    instanceClass: aws.rds.InstanceTypes.T3_Micro,
    allocatedStorage: 5,
    dbSubnetGroupName: subnetGroup.id,
    vpcSecurityGroupIds: cluster.securityGroups.map((g) => g.id),
    name: dbName,
    username: dbUsername,
    password: dbPassword,
    skipFinalSnapshot: true,
  });

  const connectionString = pulumi.interpolate`postgres://${dbUsername}:${dbPassword}@${db.endpoint}/${dbName}?sslmode=disable`;

  return { connectionString, cluster };
}
