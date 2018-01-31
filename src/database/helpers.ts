import { SqlQuery } from "./../types";
import * as _ from "lodash";

export function sql(strings: TemplateStringsArray, ...params: any[]): SqlQuery {
  return {
    query: strings.join("?"),
    params,
  };
}

type ObjectWithStringKeys = {[key: string]: any};

export function snakeCaseKeys(o: ObjectWithStringKeys): ObjectWithStringKeys {
  return _.mapKeys(o, (value, key) => _.snakeCase(key));
}

export function transformToIntArray (list: string): Array<number> {
  return list.split(',').map(id => parseInt(id))
}
