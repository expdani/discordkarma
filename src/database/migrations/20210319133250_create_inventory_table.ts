import * as Knex from "knex";

const TABLE_NAME = "inventory";

/**
 * Method that creates the table when migrations are run
 */
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(TABLE_NAME, function (table) {
        /**
         * The id of the Discord user
         */
        table.string("userID").notNullable();
        /**
         * Entire inventory in json
         */
        table.json("inventory").notNullable();
        /**
         * Created_at and deleted_at
         */
        table.timestamps();
        /**
         * This column must be unique
         */
        table.unique(["userID"]);
    });
}

/**
 * Method that drops the table
 */
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(TABLE_NAME);
}
