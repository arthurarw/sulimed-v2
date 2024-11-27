import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";

const expo = SQLite.openDatabaseSync("sulimed.db");

const db = drizzle(expo);
