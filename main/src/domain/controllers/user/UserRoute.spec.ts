import request from "supertest";
import app from "../../../app/config/app";
import { CreateUserInput } from "../../usecases/User/user.dto";

describe("E2E user entity test", () => {
  it("should return user 1", async () => {
    const response = await request(app).get("/api/user");

    expect(response.status).toBe(200);
    expect(response.body[0].id).toBe(1);
  });
});
