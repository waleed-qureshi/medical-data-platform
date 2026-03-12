const request = require("supertest");
const app = require("../server");
const { resetDatabase } = require("./setupDb");

let token;

beforeAll(async () => {
  await resetDatabase();

  await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "patientuser@example.com",
    password: "password123",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "patientuser@example.com",
    password: "password123",
  });

  token = loginRes.body.token;
});

describe("Patient endpoints", () => {
  test("should create and retrieve a patient", async () => {
    const createRes = await request(app)
      .post("/api/patients")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Alice",
        age: 35,
        gender: "female",
        diagnosis: "hypertension",
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty("id");

    const listRes = await request(app)
      .get("/api/patients")
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThan(0);
  });
});
