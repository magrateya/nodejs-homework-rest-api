const Contacts = require('../model/contacts');
const { HttpCode } = require('../helpers/constants');

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await Contacts.listContacts(userId, req.query);
    return res.json({
      status: 'Success',
      code: HttpCode.OK,
      message: 'Contacts found',
      data: {
        ...contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(req.params.contactId, userId);
    if (contact) {
      return res.json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Contact found',
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        code: HttpCode.NOT_FOUND,
        message: 'Not Found',
      });
    }
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact({ ...req.body, owner: userId });
    return res.status(201).json({
      status: 'Success',
      code: HttpCode.CREATED,
      message: 'Contacts created',
      data: {
        contact,
      },
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(req.params.contactId, userId);
    if (contact) {
      return res.json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Contact deleted',
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        code: HttpCode.NOT_FOUND,
        message: 'Not Found',
      });
    }
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
      userId,
    );
    if (contact) {
      return res.json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Contact updated',
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        code: HttpCode.NOT_FOUND,
        message: 'Not Found',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
};
