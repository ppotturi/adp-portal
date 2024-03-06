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
        .string("entity_identifier")
        .notNullable()
        .comment("Entity Identifier of Programme Manager");
      table
        .string("name")
        .notNullable()
        .comment("Name of Programme Manager")
    })}
  
  /**
   * @param {import('knex').Knex} knex
   */
  exports.down = async function down(knex) {
      return knex.schema.dropTable('programme_managers');
    };