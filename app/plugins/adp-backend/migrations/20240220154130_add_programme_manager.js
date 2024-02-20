/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  return knex.schema.createTable('programme_manager', table => {
    table.comment('Stores Programme Managers');
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.fn.uuid())
      .comment('Auto-generated ID');
    table
      .string("programme_manager")
      .notNullable()
      .comment("Name of Programme Manager")
    table
      .uuid('delivery_programme')
      .notNullable()
      .comment('ID of the Delivery Programme the Programme Manager is assigned to');
    table
      .foreign('delivery_programme').references('id').inTable('delivery_programme')
  })}

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
    return knex.schema.dropTable('programme_manager');
  };