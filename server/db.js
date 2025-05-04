import 'dotenv/config';
import {Sequelize} from "@sequelize/core";
import {PostgresDialect} from "@sequelize/postgres";

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

const sequelize = new Sequelize({
    dialect: PostgresDialect,
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    // logging: console.log,
});

export default sequelize;