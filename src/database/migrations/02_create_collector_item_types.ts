import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable("collector_item_type", table =>{
        table.integer("collector_point_id")
            .notNullable()
            .references("id")
            .inTable("collector_point");
        table.integer("item_type_id")
            .notNullable()
            .references("id")
            .inTable("item_type");        
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTableIfExists("collector_item_type");
}