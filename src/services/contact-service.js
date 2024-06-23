import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createContactValidation,
  getContactValidation,
  searchContactValidation,
  updateContactValidation,
} from "../validations/contact-validation.js";
import { validate } from "../validations/validations.js";

const create = async (user, request) => {
  const contact = validate(createContactValidation, request);
  contact.username = user.username;

  return prismaClient.contact.create({
    data: contact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

const get = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const contact = await prismaClient.contact.findFirst({
    where: {
      username: user.username,
      id: contactId,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "Contact is not found");
  }

  return contact;
};

const update = async (user, request) => {
  const contact = validate(updateContactValidation, request);

  const totalContactInDB = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contact.id,
    },
  });

  if (totalContactInDB !== 1) {
    throw new ResponseError(404, "Contact is not found");
  }

  return prismaClient.contact.update({
    where: {
      id: contact.id,
    },
    data: {
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

const remove = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const TotatInDB = await prismaClient.contact.count({
    where: {
      username: user,
      id: contactId,
    },
  });

  if (TotatInDB !== 1) {
    throw new ResponseError(404, "contact is not found");
  }

  return prismaClient.contact.delete({
    where: {
      id: contactId,
    },
  });
};

const search = async (user, request) => {
  request = validate(searchContactValidation, request);

  const skip = (request.page - 1) * request.size;

  const filter = [];

  filter.push({
    username: user,
  });

  if (request.name) {
    filter.push({
      OR: [
        {
          first_name: {
            contains: request.name,
          },
          last_name: {
            contains: request.name,
          },
        },
      ],
    });
  }
  if (request.email) {
    filter.push({
      email: {
        contains: request.email,
      },
    });
  }

  if (request.phone) {
    filter.push({
      phone: {
        contains: request.phone,
      },
    });
  }
  const contacts = await prismaClient.contact.findMany({
    where: {
      AND: filter,
    },
    take: request.size,
    skip: skip,
  });

  const totalItem = await prismaClient.contact.count({
    where: {
      AND: filter,
    },
  });

  return {
    data: contacts,
    paging: {
      page: request.page,
      total_item: totalItem,
      total_page: Math.ceil(totalItem / request.size),
    },
  };
};

export default {
  create,
  get,
  update,
  remove,
  search,
};
