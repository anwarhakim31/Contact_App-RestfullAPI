import supertest from "supertest";
import { web } from "../src/app/web";

import {
  createTestContact,
  createTestManyContact,
  createTestUser,
  getTestContact,
  removeAllTesContact,
  removeTestUser,
} from "./test.util";
import { logger } from "../src/app/logging";

describe("POST /api/contact", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTesContact();
    await removeTestUser();
  });

  it("should can create new contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "test",
        last_name: "test",
        email: "tes@hakim.com",
        phone: "081310635243",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("tes@hakim.com");
    expect(result.body.data.phone).toBe("081310635243");
  });

  it("should reject create contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "test",
        email: "tes",
        phone: "0811321313218392189382913912132131310635243",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTesContact();
    await removeTestUser();
  });

  it("should can get Contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it("should retrun 404 if contact id isnot found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTesContact();
    await removeTestUser();
  });

  it("should can update existing contact", async () => {
    const tesContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + tesContact.id)
      .set("Authorization", "test")
      .send({
        first_name: "anwar",
        last_name: "hakim",
        email: "anwarhakim@gmail.com",
        phone: "08912312313",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(tesContact.id);
    expect(result.body.data.first_name).toBe("anwar");
    expect(result.body.data.last_name).toBe("hakim");
    expect(result.body.data.email).toBe("anwarhakim@gmail.com");
    expect(result.body.data.phone).toBe("08912312313");
  });
  it("should reject if response invalid", async () => {
    const tesContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + tesContact.id)
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "hakim",
        email: "anwarhakim",
        phone: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  it("should reject if contact is not found", async () => {
    const tesContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + (tesContact.id + 1))
      .set("Authorization", "test")
      .send({
        first_name: "anwar",
        last_name: "hakim",
        email: "anwarhakim@gmail.com",
        phone: "023112312",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("delete /api/user/:contactId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTesContact();
    await removeTestUser();
  });

  it("should can delete contact", async () => {
    let testContact = await getTestContact();

    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testContact = await getTestContact();

    expect(testContact).toBeNull();
  });
  it("should reject is contact is not found", async () => {
    let testContact = await getTestContact();

    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id + 1)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestManyContact();
  });

  afterEach(async () => {
    await removeAllTesContact();
    await removeTestUser();
  });

  it("should can search without parameters", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });
  it("should can search to page 2", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({ page: 2 })
      .set("Authorization", "test");

    // logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });
  it("should can search using name", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({ name: "test 1" })
      .set("Authorization", "test");

    // logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
  it("should can search using email", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({ email: "test1@hakim.com" })
      .set("Authorization", "test");

    // logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(1);
  });
  it("should can search using phone", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({ phone: "0813106352431" })
      .set("Authorization", "test");

    // logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
});
