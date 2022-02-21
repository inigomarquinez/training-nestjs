import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity() // This tells TypeORM that this class is an entity and should be persisted to the database as a table
export class User {
  @PrimaryGeneratedColumn() // This tells TypeORM that this property is the primary key of the table and will be automatically generated
  id: number;

  @Column() // This tells TypeORM that this property is a column of type string
  email: string;

  @Column() // This tells TypeORM that this property is a column of type string
  password: string;
}
