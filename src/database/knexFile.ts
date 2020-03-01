import {env} from "../../environment";

/**
 * Configuration for the knex library
 */
module.exports = {
    client: "mysql",
    connection: {
        host: env.DATABASE_HOST,
        user: env.DATABASE_USER,
        password: env.DATABASE_PASSWORD,
        database: env.DATABASE_NAME,
        port: env.DATABASE_PORT || "3306",
    },
    migrations: {
        tableName: "migrations",
    },
};
