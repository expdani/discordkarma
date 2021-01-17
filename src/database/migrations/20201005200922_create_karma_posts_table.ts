import * as Knex from "knex";

const TABLE_NAME = "karma_posts";

/**
 * Method that creates the karma_posts table when migrations are run
 */
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(TABLE_NAME, function (table) {
        /**
         * The id of the Discord user
         */
        table.string("userID").notNullable();
        /**
         * The id of the Discord server
         */
        table.string("serverID").notNullable();
        /**
         * The id of the message
         */
        table.string("messageID").notNullable();
        /**
         * The id of the author
         */
        table.string("authorID").notNullable();
        /**
         * Type of the vote
         */
        table.string("vote").notNullable();
        /**
         * Created_at and deleted_at
         */
        table.timestamps();
        /**
         * These columns must be unique together
         */
        table.unique(["userID", "serverID", "messageID", "authorID"]);
    });
}

/**
 * Method that drops the table
 */
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(TABLE_NAME);
}
