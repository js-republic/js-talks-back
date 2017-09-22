export interface SqlQuery {
  query: string;
  params: any[];
}

export interface SelectResult {
  rows: any[];
  fields: any[];
}

export interface Commands {
  select: (sql: SqlQuery) => Promise<SelectResult>;
  update: (sql: SqlQuery) => Promise<number>;
}
