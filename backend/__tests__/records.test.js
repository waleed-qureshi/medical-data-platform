const request = require("supertest");
const app = require("../server");
const { resetDatabase } = require("./setupDb");

let token;
let patientId;

beforeAll(async () => {
  await resetDatabase();

  await request(app).post("/api/auth/register").send({
    name: "Record User",
    email: "recorduser@example.com",
    password: "password123",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "recorduser@example.com",
    password: "password123",
  });

  token = loginRes.body.token;

  const createRes = await request(app)
    .post("/api/patients")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Charlie",
      age: 45,
      gender: "male",
      diagnosis: "diabetes",
    });

  patientId = createRes.body.id;
});

describe("Records endpoints", () => {
  test("should create and retrieve records for a patient", async () => {
    const createRes = await request(app)
      .post("/api/records")
      .set("Authorization", `Bearer ${token}`)
      .send({
        patient_id: patientId,
        blood_pressure: 120,
        cholesterol: 180,
        glucose: 90,
        notes: "Initial visit",
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty("summary");

    const getRes = await request(app)
      .get(`/api/records/${patientId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveProperty("records");
    expect(getRes.body.records.length).toBeGreaterThan(0);
  });
});
