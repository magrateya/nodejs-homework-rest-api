const fs = require('fs/promises');
// const contacts = require('./contacts.json');
const path = require('path');
const { v4: uuid } = require('uuid');
const contactsPath = path.join(__dirname, './contacts.json');

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath, 'utf-8');
  return JSON.parse(contacts);
};

const getContactById = async contactId => {
  const contacts = await listContacts();
  const contact = contacts.find(contact => contact.id.toString() === contactId);
  return contact;
};

const removeContact = async contactId => {
  const contacts = await listContacts();
  const contact = contacts.find(contact => contact.id.toString() === contactId);
  const updatedContacts = contacts.filter(
    contact => contact.id.toString() !== contactId,
  );
  await fs.writeFile(
    contactsPath,
    JSON.stringify(updatedContacts, null, 2),
    'utf8',
  );
  return contact;
};

const addContact = async body => {
  const contacts = await listContacts();
  const id = uuid();
  const record = { id, ...body };
  const updatedContacts = [...contacts, record];
  await fs.writeFile(
    contactsPath,
    JSON.stringify(updatedContacts, null, 2),
    'utf8',
  );
  return record;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(
    ({ id }) => id.toString() === contactId,
  );
  contacts[contactIndex] = { ...contacts[contactIndex], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf8');
  return contacts[contactIndex];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
