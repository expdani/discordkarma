// This is required for the migrate commands
require("dotenv").config({path: "../../.env"});

/**
 * Configuration for the knex library
 */
module.exports = {
    client: "mysql",
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT || "3306",
    },
    migrations: {
        tableName: "migrations",
    },
};
