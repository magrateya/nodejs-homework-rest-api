const Contacts = require('../model/index');

const getAll = async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({
      status: 'Success',
      code: 200,
      message: 'Contacts found',
      data: {
        contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res.json({
        status: 'Success',
        code: 200,
        message: 'Contact found',
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        code: 404,
        message: 'Not Found',
      });
    }
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res.status(201).json({
      status: 'Success',
      code: 201,
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
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.json({
        status: 'Success',
        code: 200,
        message: 'Contact deleted',
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        code: 404,
        message: 'Not Found',
      });
    }
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
    );
    if (contact) {
      return res.json({
        status: 'Success',
        code: 200,
        message: 'Contact updated',
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        code: 404,
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
