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

const getTestContact = async () => {
  return prismaClient.contact.findFirst({
    where: {
      username: "test",
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
};
