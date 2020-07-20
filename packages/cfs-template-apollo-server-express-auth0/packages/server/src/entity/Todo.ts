import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "todos" })
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  complete!: boolean;

  @Column()
  uid!: string;
}
