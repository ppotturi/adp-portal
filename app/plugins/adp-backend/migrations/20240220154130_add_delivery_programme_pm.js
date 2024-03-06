/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  return knex.schema.createTable('delivery_programme_pm', table => {
    table.comment('Stores Delivery Programme Managers')
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.fn.uuid())
      .comment('Auto-generated ID');
    table
      .uuid('delivery_programme_id')
      .notNullable()
      .comment('ID of the Delivery Programme the Programme Manager is assigned to')
    table
      .foreign('delivery_programme_id').references('id').inTable('delivery_programme')
    table
      .uuid('programme_manager_id')
      .notNullable()
      .comment('ID of the Programme Manager')
    table
      .foreign('programme_manager_id').references('id').inTable('programme_manager')
    table.unique(['delivery_programme_id', 'programme_manager_id']); 
    })}

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
    return knex.schema.dropTable('delivery_programme_pm');
  };