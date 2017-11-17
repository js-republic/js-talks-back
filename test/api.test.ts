import * as app from "../src/server";
import * as request from "supertest";

describe.skip("API", () => {
    test("should work", async () => {
        const response = await request(app).get("/api");
        expect(response.status).toBe(200);
    });

    test("should serve talks", async () => {
        const response = await request(app).get("/api/talks");
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
    });
});
