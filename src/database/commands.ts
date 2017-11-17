import {Pool, Connection} from "mysql";
import { defaultConfig } from "../config/database";
import { Commands, SelectResult, SqlQuery } from "./types";

export function update(
  connection: Pool | Connection,
  sql: SqlQuery,
): Promise<number> {
  return new Promise((resolve, reject) => {
    connection.query(sql.query, sql.params, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.insertId as number);
      }
    });
  });
}

export function select(
  connection: Pool | Connection,
  sql: SqlQuery
): Promise<SelectResult> {
  return new Promise((resolve, reject) => {
    connection.query(sql.query, sql.params, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve({ rows, fields });
      }
    });
  });
}