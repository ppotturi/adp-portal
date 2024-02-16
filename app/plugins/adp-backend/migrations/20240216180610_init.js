exports.up = function(knex) {
    return knex.schema.table('arms_;ength_body', function(table) {
      table.renameColumn('short_name', 'alias');
    
      // TODO : table.comment();
    });
  };