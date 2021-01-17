import * as Knex from "knex";

const TABLE_NAME = "karma_total";

/**
 * Method that creates the karma_total table when migrations are run
 */
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(TABLE_NAME, function (table) {
        table.increments("id");
        /**
         * The id of the Discord user
         */
        table.string("user_id").notNullable();
        /**
         * The id of the Discord server
         */
        table.string("server_id").notNullable();
        /**
         * The amount of karma the user has
         */
        table.integer("total").notNullable();
        /**
         * Created_at and deleted_at
         */
        table.timestamps();
        /**
         * These columns must be unique together
         */
        table.unique(["user_id", "server_id"]);
    });
}

/**
 * Method that drops the table
 */
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(TABLE_NAME);
}
