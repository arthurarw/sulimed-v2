import * as SQLite from "expo-sqlite";

export async function initializeDatabase(database: SQLite.SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  const result = await database.getFirstAsync<{ user_version: number } | null>(
    'PRAGMA user_version'
  );

  let currentDbVersion = 0;
  if (result !== null && result.user_version !== undefined) {
    currentDbVersion = result.user_version;
  }

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    /*console.log('Dropping tables...');
    await database.execAsync(`DROP TABLE IF EXISTS customers;`);
    await database.execAsync(`DROP TABLE IF EXISTS contract_categories;`);
    await database.execAsync(`DROP TABLE IF EXISTS cities;`);
    await database.execAsync(`DROP TABLE IF EXISTS relationships;`);
    await database.execAsync(`DROP TABLE IF EXISTS contracts;`);
    await database.execAsync(`DROP TABLE IF EXISTS neighborhoods;`);
    await database.execAsync(`DROP TABLE IF EXISTS streets;`);
    await database.execAsync(`DROP TABLE IF EXISTS kinships;`);*/

    console.log("Creating tables...");

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          email TEXT NULL,
          phone TEXT NULL,
          telephone TEXT NULL,
          zipcode TEXT NULL,
          street TEXT NULL,
          neighborhood TEXT NULL,
          number TEXT NULL,
          city TEXT NULL,
          state TEXT NULL,
          signature TEXT NULL,
          created_at TEXT NULL,
          document TEXT NULL,
          document_2 TEXT NULL,
          external_id INTEGER NULL,
          sync BOOLEAN NOT NULL DEFAULT 0
        );
      `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS contract_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          external_id INTEGER NOT NULL,
          description TEXT NOT NULL
        );
      `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS cities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          initials TEXT NOT NULL,
          external_id INTEGER NULL,
          state_id INTEGER NULL
        );
      `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS relationships (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          external_id INTEGER NOT NULL
        );
      `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS contracts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          is_company BOOLEAN NOT NULL DEFAULT 0,
          fathers_name TEXT NULL,
          mothers_name TEXT NULL,
          observation TEXT NULL,
          unity_consumer TEXT NULL,
          phone_1 TEXT NULL,
          phone_2 TEXT NULL,
          observation_phone_1 TEXT NULL,
          observation_phone_2 TEXT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          email TEXT NULL,
          phone TEXT NULL,
          telephone TEXT NULL,
          zipcode TEXT NULL,
          street TEXT NULL,
          neighborhood TEXT NULL,
          number TEXT NULL,
          city TEXT NULL,
          state TEXT NULL,
          signature TEXT NULL,
          created_at TEXT NULL,
          document TEXT NULL,
          document_2 TEXT NULL,
          external_id INTEGER NULL,
          sync BOOLEAN NOT NULL DEFAULT 0
        );
      `);

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS neighborhoods (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          external_id INTEGER NULL,
          city_id INTEGER NULL
        );
      `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS streets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        external_id INTEGER NULL,
        city_id INTEGER NULL
      );
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS kinships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        external_id INTEGER NULL
      );
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS dependents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        birthday TEXT NULL,
        kinship_id INTEGER NULL,
        person_id INTEGER NULL
      );
    `);

    currentDbVersion = 1;
  }

  await database.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
