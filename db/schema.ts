import * as SQLite from "expo-sqlite";

export async function initializeDatabase(database: SQLite.SQLiteDatabase) {
  const DATABASE_VERSION = 10;

  const result = await database.getFirstAsync<{ user_version: number } | null>(
    'PRAGMA user_version'
  );

  let currentDbVersion = 0;
  if (result !== null && result.user_version !== undefined) {
    currentDbVersion = result.user_version;
  }

  console.log(`Current database version: ${currentDbVersion} - Expected version: ${DATABASE_VERSION}`);

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  console.log('Dropping tables...');
  await database.execAsync(`DROP TABLE IF EXISTS contract_categories;`);
  await database.execAsync(`DROP TABLE IF EXISTS contract_business_categories;`);
  await database.execAsync(`DROP TABLE IF EXISTS cities;`);
  await database.execAsync(`DROP TABLE IF EXISTS contracts;`);
  await database.execAsync(`DROP TABLE IF EXISTS neighborhoods;`);
  await database.execAsync(`DROP TABLE IF EXISTS streets;`);
  await database.execAsync(`DROP TABLE IF EXISTS kinships;`);
  await database.execAsync(`DROP TABLE IF EXISTS dependents;`);

  console.log("Creating tables...");

  await database.execAsync(`
        CREATE TABLE IF NOT EXISTS contract_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          price NUMERIC NOT NULL,
          description TEXT NOT NULL
        );
      `);

  await database.execAsync(`
        CREATE TABLE IF NOT EXISTS contract_business_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          price NUMERIC NOT NULL,
          description TEXT NOT NULL,
          max_colabs INTEGER NULL DEFAULT 0
        );
      `);

  await database.execAsync(`
        CREATE TABLE IF NOT EXISTS cities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );
      `);

  await database.execAsync(`
        CREATE TABLE IF NOT EXISTS contracts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          is_company BOOLEAN NOT NULL DEFAULT 0,
          colab_id INTEGER NULL,
          pre_contract TEXT NULL DEFAULT 'A',
          category_id INTEGER NULL,
          category_business_id INTEGER NULL,
          person_type TEXT NULL DEFAULT 'F',
          person_name TEXT NULL,
          person_nickname TEXT NULL,
          person_observation TEXT NULL,
          gender INTEGER NULL DEFAULT 1,
          civil_state INTEGER NULL DEFAULT 1,
          observation TEXT NULL,
          unity_consumer TEXT NULL,
          dealership_id INTEGER NULL,
          phone_1 TEXT NULL,
          phone_2 TEXT NULL,
          cellphone TEXT NULL,
          observation_phone_1 TEXT NULL,
          observation_phone_2 TEXT NULL,
          observation_cellphone TEXT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          email TEXT NULL,
          zipcode TEXT NULL,
          complement TEXT NULL,
          street_id INTEGER NULL,
          neighborhood_id INTEGER NULL,
          number TEXT NULL,
          city_id INTEGER NULL,
          signature TEXT NULL,
          created_at TEXT NULL,
          sale_at TEXT NULL,
          contract_at TEXT NULL,
          document TEXT NULL,
          document_2 TEXT NULL,
          company_fundation_at TEXT NULL,
          mensality_price NUMERIC NULL,
          due_contract_day INTEGER NULL DEFAULT 10,
          observation_remote TEXT NULL,
          parents_address TEXT NULL,
          father_name TEXT NULL,
          mother_name TEXT NULL,
          naturality_city INTEGER NULL,
          bankslip_installments_generated TEXT NULL DEFAULT 'N',
          bankslip_installments INTEGER NULL,
          membership_fee NUMERIC NULL,
          account_holder_name TEXT NULL,
          account_holder_type TEXT NULL DEFAULT 'F',
          account_document TEXT NULL,
          account_document_2 TEXT NULL,
          action_registration TEXT NULL DEFAULT 'I',
          action_registration_send TEXT NULL DEFAULT 'N',
          installation_partner TEXT NULL,
          phone TEXT NULL,
          telephone TEXT NULL,
          sync BOOLEAN NOT NULL DEFAULT 0,
          sync_at TEXT NULL
        );
      `);

  await database.execAsync(`
        CREATE TABLE IF NOT EXISTS neighborhoods (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );
      `);

  await database.execAsync(`
      CREATE TABLE IF NOT EXISTS streets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `);

  await database.execAsync(`
      CREATE TABLE IF NOT EXISTS kinships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `);

  await database.execAsync(`
      CREATE TABLE IF NOT EXISTS dependents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contract_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        birthday TEXT NULL,
        kinship_name TEXT NULL
      );
    `);

  //currentDbVersion = 1;
  console.log(`Database updated to version ${currentDbVersion}`);
  await database.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
