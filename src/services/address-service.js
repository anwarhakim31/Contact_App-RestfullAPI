import { request } from "express";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createAddressValidation,
  getAddressValidation,
  updateAddressValidation,
} from "../validations/address-validation.js";
import {
  createContactValidation,
  getContactValidation,
} from "../validations/contact-validation.js";
import { validate } from "../validations/validations.js";

const create = async (user, contactId, request) => {
  contactId = validate(getContactValidation, contactId);

  const totalContactInDB = await prismaClient.contact.count({
    where: {
      username: user,
      id: contactId,
    },
  });

  if (totalContactInDB !== 1) {
    throw new ResponseError("404", "Contact is not Found");
  }

  const address = validate(createAddressValidation, request);
  address.contact_id = contactId;
  return prismaClient.address.create({
    data: address,
    select: {
      id: true,
      street: true,
      city: true,
      country: true,
      province: true,
      postal_code: true,
    },
  });
};

const checkContactMustExist = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const contactInDB = await prismaClient.contact.count({
    where: {
      username: user,
      id: contactId,
    },
  });

  if (contactInDB !== 1) {
    throw new ResponseError(404, "User is not found");
  }

  return contactId;
};

const get = async (user, contactId, addressId) => {
  contactId = await checkContactMustExist(user, contactId);
  addressId = validate(getContactValidation, addressId);

  const address = await prismaClient.address.findFirst({
    where: {
      contact_id: contactId,
      id: addressId,
    },
    select: {
      id: true,
      street: true,
      city: true,
      country: true,
      province: true,
      postal_code: true,
    },
  });

  if (!address) {
    throw new ResponseError(404, "Address is not found");
  }

  return address;
};

const update = async (user, contactId, request) => {
  contactId = await checkContactMustExist(user, contactId);

  const address = await validate(updateAddressValidation, request);

  const totalAddressInDB = await prismaClient.address.count({
    where: {
      id: address.id,
    },
  });

  if (totalAddressInDB !== 1) {
    throw new ResponseError(404, "Address is not found");
  }

  return prismaClient.address.update({
    where: {
      id: address.id,
    },
    data: {
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

const remove = async (user, contactId, addressId) => {
  contactId = await checkContactMustExist(user, contactId);
  addressId = await validate(getContactValidation, addressId);

  const totalAddressInDB = await prismaClient.address.count({
    where: {
      contact_id: contactId,
      id: addressId,
    },
  });

  if (totalAddressInDB !== 1) {
    throw new ResponseError(404, "Addres is not found");
  }

  return prismaClient.address.delete({
    where: {
      id: addressId,
    },
  });
};

const list = async (user, contactId) => {
  contactId = await checkContactMustExist(user, contactId);

  return prismaClient.address.findMany({
    where: {
      contact_id: contactId,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

export default { create, get, update, remove, list };
