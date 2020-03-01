/* eslint-disable */
// Eslint disable because knex requires to use require instead of imports
const knex = require("knex");
const knexFile = require("./knexFile");

/**
 * Export an instance of Knex
 * This instance allows us to use the Knex query builder
 */
module.exports = knex(knexFile);
