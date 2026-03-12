const request = require("supertest");
const app = require("../server");
const { resetDatabase } = require("./setupDb");

beforeAll(async () => {
  await resetDatabase();
});

describe("Auth endpoints", () => {
  test("should register and login a user", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty("id");

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
  });

  test("should allow admin registration when enabled", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email: "admin@example.com",
      password: "adminpass",
      role: "admin",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("role", "admin");
  });
});
