import * as mysql from "mysql";
interface SqlQuery {
  query: string;
  params: any[];
}

interface SelectResult {
  rows: any[];
  fields: any[];
}

export function sql(strings: TemplateStringsArray, ...params: any[]): SqlQuery {
  return {
    query: strings.join("?"),
    params,
  };
}

export function update<T>(sql: SqlQuery): Promise<string> {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection("toto");
    connection.query(sql.query, sql.params, (error, results, fields) => {
      if (error) reject(error);
      resolve(results.insertId);
    });
  });
}

export function select<T>(sql: SqlQuery): Promise<SelectResult> {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection("toto");
    connection.query(sql.query, sql.params, (error, rows, fields) => {
      if (error) reject(error);
      resolve({ rows, fields });
    });
  });
}