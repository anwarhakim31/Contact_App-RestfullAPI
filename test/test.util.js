import { prismaClient } from "../src/app/database.js";
import bcrypt from "bcrypt";

const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: "test",
    },
  });
};

const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: "test",
      password: await bcrypt.hash("rahasia", 10),
      name: "test",
      token: "test",
    },
  });
};

const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      username: "test",
    },
  });
};

const removeAllTesContact = async () => {
  await prismaClient.contact.deleteMany({
    where: {
      username: "test",
    },
  });
};

const createTestContact = async () => {
  await prismaClient.contact.create({
    data: {
      username: "test",
      first_name: "test",
      last_name: "test",
      email: "tes@hakim.com",
      phone: "081310635243",
    },
  });
};

const createTestManyContact = async () => {
  for (let i = 0; i < 15; i++) {
    await prismaClient.contact.create({
      data: {
        username: `test`,
        first_name: `test ${i}`,
        last_name: `test ${i}`,
        email: `test${i}@hakim.com`,
        phone: `081310635243${i}`,
      },
    });
  }
};

const getTestContact = async () => {
  return prismaClient.contact.findFirst({
    where: {
      username: "test",
    },
  });
};

const createTestAddress = async () => {
  const contact = await getTestContact();

  await prismaClient.address.create({
    data: {
      contact_id: contact.id,
      street: "jalan tes",
      city: "kota tes",
      province: "provinsi tes",
      country: "indonesia",
      postal_code: "232423",
    },
  });
};

const removeAllTesAddresses = async () => {
  await prismaClient.address.deleteMany({
    where: {
      contact: {
        username: "test",
      },
    },
  });
};

const getTestAddress = async () => {
  return prismaClient.address.findFirst({
    where: {
      contact: {
        username: "test",
      },
    },
  });
};

export {
  removeTestUser,
  createTestUser,
  getTestUser,
  removeAllTesContact,
  createTestContact,
  getTestContact,
  createTestManyContact,
  removeAllTesAddresses,
  createTestAddress,
  getTestAddress,
};
