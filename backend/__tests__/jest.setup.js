// Optional test setup, including mock DB behavior when USE_MOCK_DB=true.

if (process.env.USE_MOCK_DB === "true") {
  process.env.ALLOW_ADMIN_REGISTRATION = "true";
  process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";

  const users = [];
  const patients = [];
  const records = [];

  const mockQuery = jest.fn(async (query, params) => {
    const normalized = query.trim().toUpperCase();
    const emailCondition = normalized.includes("FROM USERS") && normalized.includes("WHERE EMAIL");

    if (emailCondition) {
      const email = params[0];
      const user = users.find((u) => u.email === email);
      return [[user].filter(Boolean)];
    }

    if (normalized.startsWith("INSERT INTO USERS")) {
      const [name, email, password_hash, role] = params;
      const id = users.length + 1;
      users.push({ id, name, email, password_hash, role, created_at: new Date() });
      return [{ insertId: id }];
    }

    if (normalized.startsWith("SELECT ID FROM PATIENTS")) {
      const patientId = Number(params[0]);
      const patient = patients.find((p) => p.id === patientId);
      return [[patient].filter(Boolean)];
    }

    if (normalized.startsWith("INSERT INTO PATIENTS")) {
      const [name, age, gender, diagnosis, created_by] = params;
      const id = patients.length + 1;
      patients.push({ id, name, age, gender, diagnosis, created_by });
      return [{ insertId: id }];
    }

    if (normalized.startsWith("SELECT * FROM RECORDS")) {
      const patientId = Number(params[0]);
      const filtered = records.filter((r) => r.patient_id === patientId);
      return [filtered];
    }

    if (normalized.startsWith("INSERT INTO RECORDS")) {
      const [patient_id, blood_pressure, cholesterol, glucose, notes] = params;
      const id = records.length + 1;
      records.push({ id, patient_id, blood_pressure, cholesterol, glucose, notes });
      return [{ insertId: id }];
    }

    // For other selects (like listing patients), return default
    if (normalized.startsWith("SELECT * FROM PATIENTS")) {
      return [patients];
    }

    if (normalized.startsWith("SELECT ID, NAME, EMAIL, ROLE")) {
      return [users.map(({ id, name, email, role, created_at }) => ({ id, name, email, role, created_at }))];
    }

    return [[]];
  });

  jest.mock("../config/db", () => ({ query: mockQuery }));
}

