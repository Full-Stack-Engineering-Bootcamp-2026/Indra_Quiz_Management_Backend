import "reflect-metadata";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",

  host: process.env.DB_HOST,

  port: Number(process.env.DB_PORT),

  username: process.env.DB_USERNAME,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  synchronize: false,

  logging: true,

  entities: ["src/domains/**/entities/*.entity.ts"],

  migrations: ["src/migrations/*.ts"],

  subscribers: [],

  migrationsTableName: "migrations",
});
