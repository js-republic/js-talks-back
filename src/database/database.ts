import { Pool, ConnectionConfig, createPool } from "mysql";
import { defaultConfig } from "../config/database";
import { select as rawSelect, update as rawUpdate } from "./commands";
import { Commands, SqlQuery } from "./types";

let pool: Pool;
let commands: Commands;

export function select(sql: SqlQuery) {
  checkDbInitilization();
  return commands.select(sql);
}
export function update(sql: SqlQuery) {
  checkDbInitilization();
  return commands.update(sql);
}

export function initDatabase(config: ConnectionConfig = defaultConfig) {
  console.log("connexion", config);
  pool = createPool(config);
  commands = bindCommands(pool);
}

function bindCommands(pool: Pool): Commands {
  return {
    select: sqlQuery => rawSelect(pool, sqlQuery),
    update: sqlQuery => rawUpdate(pool, sqlQuery)
  };
}

function checkDbInitilization() {
  if (!commands) {
    console.warn(`Database has not been initialized
    => Calling initDatabase() with default config...`);
    initDatabase();
  }
}
