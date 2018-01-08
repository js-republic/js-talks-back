import { sql, snakeCaseKeys } from "../src/database/helpers";

describe("database helpers", () => {
  it("should return an SqlQuery", () => {
    // given
    const anId = 5;

    // when
    const query = sql`select * from table where id=${anId}`;

    // then
    expect(query).toEqual({
      query: "select * from table where id=?",
      params: [5],
    });
  });

  it("should transform object keys in snake case", () => {
    // given
    const data = {
      "data-test": 0,
      "stringItemTest": "ok"
    };

    // when
    const dataSnakeCaseKeys = snakeCaseKeys(data);

    // then
    expect(Object.keys(dataSnakeCaseKeys)).toEqual(["data_test", "string_item_test"]);
  });
});
