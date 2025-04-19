import { DataSource } from "typeorm";
import { Organization } from "../entities/Organization";
import { User } from "../entities/User";
import { Team } from "../entities/Team";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "call_qa",
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
    entities: [Organization, User, Team],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
}); 