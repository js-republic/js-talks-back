import { SqlQuery } from "./types";

export function sql(strings: TemplateStringsArray, ...params: any[]): SqlQuery {
  return {
    query: strings.join("?"),
    params,
  };
}