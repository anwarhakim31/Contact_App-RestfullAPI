import supertest from "supertest";
import {
  createTestAddress,
  createTestContact,
  createTestUser,
  getTestAddress,
  getTestContact,
  removeAllTesAddresses,
  removeAllTesContact,
  removeTestUser,
} from "./test.util";
import { web } from "../src/app/web";

describe("POST /api/contacts/:contactId/addresses", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTesAddresses();
    await removeAllTesContact();
    await removeTestUser();
  });

  it("should can create address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "jalan tes",
        city: "kota tes",
        province: "provinsi tes",
        country: "indonesia",
        postal_code: "232423",
      });
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("jalan tes");
    expect(result.body.data.city).toBe("kota tes");
    expect(result.body.data.province).toBe("provinsi tes");
    expect(result.body.data.country).toBe("indonesia");
    expect(result.body.data.postal_code).toBe("232423");
  });

  it("should reject if requst is invalid ", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "jalan tes",
        city: "kota tes",
        province: "provinsi tes",
        country: "",
        postal_code: "",
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + 1 + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "jalan tes",
        city: "kota tes",
        province: "provinsi tes",
        country: "indonesia",
        postal_code: "232423",
      });
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTesAddresses();
    await removeAllTesContact();
    await removeTestUser();
  });

  it("should can get address", async () => {
    const TesAddress = await getTestAddress();
    const tesContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + tesContact.id + "/addresses/" + TesAddress.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("jalan tes");
    expect(result.body.data.city).toBe("kota tes");
    expect(result.body.data.province).toBe("provinsi tes");
    expect(result.body.data.country).toBe("indonesia");
    expect(result.body.data.postal_code).toBe("232423");
  });

  it("should reject if contact is not found", async () => {
    const TesAddress = await getTestAddress();
    const tesContact = await getTestContact();

    const result = await supertest(web)
      .get(
        "/api/contacts/" + (tesContact.id + 1) + "/addresses/" + TesAddress.id
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
  it("should reject if address is not found", async () => {
    const TesAddress = await getTestAddress();
    const tesContact = await getTestContact();

    const result = await supertest(web)
      .get(
        "/api/contacts/" + tesContact.id + "/addresses/" + (TesAddress.id + 1)
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTesAddresses();
    await removeAllTesContact();
    await removeTestUser();
  });

  it("should can update address", async () => {
    const testContact = await getTestContact();
    const testAdrress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAdrress.id)
      .set("Authorization", "test")
      .send({
        street: "jalan new tes",
        city: "kota new tes",
        province: "provinsi new tes",
        country: "amerika",
        postal_code: "232423",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testAdrress.id);
    expect(result.body.data.street).toBe("jalan new tes");
    expect(result.body.data.city).toBe("kota new tes");
    expect(result.body.data.province).toBe("provinsi new tes");
    expect(result.body.data.country).toBe("amerika");
    expect(result.body.data.postal_code).toBe("232423");
  });

  it("should reject if request is invalid", async () => {
    const testContact = await getTestContact();
    const testAdrress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAdrress.id)
      .set("Authorization", "test")
      .send({
        street: "jalan new tes",
        city: "kota new tes",
        province: "provinsi new tes",
        country: "",
        postal_code: "",
      });

    expect(result.status).toBe(400);
  });
});

describe("DELETE /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTesAddresses();
    await removeAllTesContact();
    await removeTestUser();
  });

  it("should can be delete address", async () => {
    const testContact = await getTestContact();
    let testAdrress = await getTestAddress();
    const result = await supertest(web)
      .delete(
        "/api/contacts/" + testContact.id + "/addresses/" + testAdrress.id
      )
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testAdrress = await getTestAddress();

    expect(testAdrress).toBeNull();
  });
  it("should reject is address is not found", async () => {
    const testContact = await getTestContact();
    const testAdrress = await getTestAddress();
    const result = await supertest(web)
      .delete(
        "/api/contacts/" + testContact.id + "/addresses/" + (testAdrress.id + 1)
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Addres is not found");
  });
});

describe("LIST /api/contacts/:contactId/addresses", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTesAddresses();
    await removeAllTesContact();
    await removeTestUser();
  });

  it("should can get list address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
  });
});
