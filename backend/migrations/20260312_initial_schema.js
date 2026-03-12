/**
 * Initial database schema migration for medical data platform.
 */

exports.up = async function (knex) {
  await knex.schema.createTableIfNotExists("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
    table.string("role").notNullable().defaultTo("user");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTableIfNotExists("patients", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.integer("age").nullable();
    table.string("gender").nullable();
    table.text("diagnosis").nullable();
    table.integer("created_by").unsigned().notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.foreign("created_by").references("users.id").onDelete("CASCADE");
  });

  await knex.schema.createTableIfNotExists("records", (table) => {
    table.increments("id").primary();
    table.integer("patient_id").unsigned().notNullable();
    table.double("blood_pressure").nullable();
    table.double("cholesterol").nullable();
    table.double("glucose").nullable();
    table.text("notes").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.foreign("patient_id").references("patients.id").onDelete("CASCADE");
  });

  await knex.schema.createTableIfNotExists("datasets", (table) => {
    table.increments("id").primary();
    table.string("file_path", 1024).notNullable();
    table.integer("uploaded_by").unsigned().notNullable();
    table.string("status").notNullable().defaultTo("uploaded");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.foreign("uploaded_by").references("users.id").onDelete("SET NULL");
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("datasets");
  await knex.schema.dropTableIfExists("records");
  await knex.schema.dropTableIfExists("patients");
  await knex.schema.dropTableIfExists("users");
};
