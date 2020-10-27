import * as aws from "@pulumi/aws";
import { InstanceArgs } from "@pulumi/aws/rds";
import * as awsx from "@pulumi/awsx";
import { Vpc } from "@pulumi/awsx/ec2";
import { Cluster } from "@pulumi/awsx/ecs";
import * as pulumi from "@pulumi/pulumi";

export interface RdsArgs {
  /**
   * The name of the database to create when the DB instance is created. If this
   * parameter is not specified, no database is created in the DB instance. Note
   * that this does not apply for Oracle or SQL Server engines. See the
   * [AWS documentation](https://docs.aws.amazon.com/cli/latest/reference/rds/create-db-instance.html)
   * for more details on what applies for those engines.
   */
  dbName: string;
  /**
   * Username for the master DB user.
   */
  dbUsername: string;
  /**
   * Password for the master DB user. Note that this may show up in logs, and
   * it will be stored in the state file.
   */
  dbPassword: pulumi.Output<string>;
  /**
   * Overrides fields defined in this component's instanceArgs, the set of
   * arguments for constructing this RDS resource.
   */
  instanceArgs?: InstanceArgs;
  /**
   * Cluster this RDS will run in. If none is provided, the default for the
   * current aws account and region is used.
   */
  cluster?: Cluster;
  /**
   * VPC this RDS will run in. If none is provided, the default for the current
   * aws account and region is used.
   */
  vpc?: Vpc;
}

export default class Rds extends pulumi.ComponentResource {
  connectionString: pulumi.Output<string>;

  constructor(name: string, args: RdsArgs, opts?: pulumi.ResourceOptions) {
    const { dbName, dbUsername, dbPassword, instanceArgs, cluster, vpc } = args;
    super("aws:Rds", name, args, opts);

    // Get the default VPC and ECS Cluster for your account.
    const vpcOrDefault = vpc ?? awsx.ec2.Vpc.getDefault();
    const clusterOrDefault = cluster ?? awsx.ecs.Cluster.getDefault();

    // Create a new subnet group for the database.
    const subnetGroup = new aws.rds.SubnetGroup(`${name}-subnet-group`, {
      subnetIds: vpcOrDefault.publicSubnetIds,
    });

    // Create a new database, using the subnet and cluster groups.
    const db = new aws.rds.Instance(`${name}-instance`, {
      engine: "postgres",
      instanceClass: aws.rds.InstanceTypes.T3_Micro,
      allocatedStorage: 1,
      dbSubnetGroupName: subnetGroup.id,
      vpcSecurityGroupIds: clusterOrDefault.securityGroups.map((g) => g.id),
      name: dbName,
      username: dbUsername,
      password: dbPassword,
      skipFinalSnapshot: true,
      ...instanceArgs,
    });

    this.connectionString = pulumi.interpolate`postgres://${dbUsername}:${dbPassword}@${db.endpoint}/${dbName}`;

    this.registerOutputs({
      /**
       * Specifies information about a data source and the means of connecting
       * to it.
       *
       * Ex. `"postgres://postgres:postgrespassword@postgres:5432/postgres"`
       */
      connectionString: this.connectionString,
    });
  }
}
