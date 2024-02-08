/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  return knex.schema.createTable('delivery_programme', table => {
    table.comment('Stores Delivery Programme data');
    table
      .string('creator')
      .notNullable()
      .comment('Username of the Delivery Programme creator');
    table
      .string('owner')
      .notNullable()
      .comment('AD group of the Delivery Programme owner');
    table
      .string('name')
      .notNullable()
      .comment('Delivery Programme name in lower case and hyphens instead of spaces');
    table
      .string('title')
      .notNullable()
      .comment('Delivery Programme name');
    table
      .string('alias')
      .nullable()
      .comment('Short form of Delivery Programme name');
    table
      .string('description')
      .notNullable()
      .comment('Description of the Delivery Programme');
    table
      .string('finance_code')
      .nullable()
      .comment('Finance code of Delivery Programme');
    table
      .string('arms_length_body')
      .notNullable()
      .comment('Name of the ALB owning the delivery programme');
    table
      .string('delivery_programme_code')
      .notNullable()
      .comment('Delivery programme code');
    table
      .string('url')
      .nullable()
      .comment('Delivery Programme URL');
    table
      .timestamp('created_at', { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Creation time of the Delivery Programme');
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.fn.uuid())
      .comment('Auto-generated Delivery Programme ID');
    table
      .timestamp('updated_at', { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Date/time when the programme was last updated');
    table
      .string('updated_by')
      .notNullable()
      .comment(
        'Username of the person who last updated the Delivery Programme',
      );
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  return knex.schema.dropTable('delivery_programme');
};
