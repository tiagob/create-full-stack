import { DataTypes, Model, Sequelize } from "sequelize";

export class Todo extends Model {
  public id!: number;

  public name!: string;

  public complete!: boolean;
}

export const sequelize = new Sequelize({
  database: process.env.DB_NAME || "todo",
  username: process.env.DB_USER || "todo",
  password: process.env.DB_PASS || "todo",
  // TODO: Update to postgres
  dialect: "mysql",
});

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
  },
  {
    sequelize,
    // TODO: Standardize table name with Hasura
    tableName: "todos",
  }
);
