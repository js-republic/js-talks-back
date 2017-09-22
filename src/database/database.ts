import * as mysql from "mysql";
import { defaultConfig } from "../config/database";
import { select as rawSelect, update as rawUpdate } from "./commands";
import { Commands, SqlQuery } from "./types";

let pool: mysql.IPool;
let commands: Commands;

export function select(sql: SqlQuery) {
  checkDbInitilization();
  return commands.select(sql);
}
export function update(sql: SqlQuery) {
  checkDbInitilization();
  return commands.update(sql);
}

export function initDatabase(
  config: mysql.IConnectionConfig = defaultConfig
) {
  pool = mysql.createPool(config);
  commands = bindCommands(pool);
}

function bindCommands(pool: mysql.IPool): Commands {
  return {
    select: rawSelect.bind(null, pool),
    update: rawUpdate.bind(null, pool),
  };
}

function checkDbInitilization() {
  if (!commands) {
    console.warn("Database has not been initialized => Calling initDatabase()...");
    initDatabase();
  }
}