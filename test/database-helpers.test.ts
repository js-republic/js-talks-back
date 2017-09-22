import { select, sql, update } from "../src/database/helpers";

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
});
