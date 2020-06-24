import { DataTypes, Model, Sequelize } from "sequelize";

export class Todo extends Model {
  public id!: number;

  public name!: string;

  public complete!: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
  },
  {
    sequelize,
    tableName: "todos",
  }
);
