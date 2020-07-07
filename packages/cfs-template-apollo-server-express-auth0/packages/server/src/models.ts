import { DataTypes, Model, Sequelize } from "sequelize";

export class Todo extends Model {
  public id!: number;

  public name!: string;

  public complete!: boolean;

  public uid!: string;
}

export const sequelize = new Sequelize(
  process.env.DATABASE_URL ||
    // TODO: Should this be in a .env instead?
    "postgres://postgres:postgrespassword@localhost:5432/postgres"
);

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "todos",
  }
);
