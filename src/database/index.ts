import knex from "knex";

// Eslint disable because knex requires to use require instead of imports
// eslint-disable-next-line
const knexFile = require("./knexFile");

/**
 * Export an instance of Knex
 * This instance allows us to use the Knex query builder
 */
export default knex(knexFile);
