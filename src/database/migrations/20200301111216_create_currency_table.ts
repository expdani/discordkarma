import * as Knex from "knex";

const TABLE_NAME = "currency";

/**
 * Method that creates the curreny table when migrations are run
 */
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(TABLE_NAME, function (table) {
        table.increments("id");
        /**
         * The id of the Discord user
         */
        table.string("userID").notNullable();
        /**
         * The amount of money the user has in his bank
         */
        table.double("bank").notNullable();
        /**
         * The amount of money the user has in his wallet
         */
        table.double("wallet").notNullable();
        /**
         * Created_at and deleted_at
         */
        table.timestamps();
    });
}

/**
 * Method that creates the curreny table when migrations are run
 */
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(TABLE_NAME);
}
