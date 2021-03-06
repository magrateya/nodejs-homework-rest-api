const Contact = require('./schemas/contact');

const listContacts = async (
  userId,
  { sortBy, sortByDesc, sub, page = '1', limit = '5' },
) => {
  const results = await Contact.paginate(
    { owner: userId },
    {
      page,
      limit,
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
      },
      // select: { ...(sub ? { ['subscription']: `${sub}` } : '') },
      populate: {
        path: 'owner',
        select: 'email subscription -_id',
      },
    },
  );
  const { docs: contatcs, totalDocs: total } = results;
  return { total: total.toString(), limit, page, contatcs };
};

const getContactById = async (id, userId) => {
  const result = await Contact.find({ _id: id, owner: userId }).populate({
    path: 'owner',
    select: 'email subscription -_id',
  });
  return result;
};

const addContact = async body => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (id, body, userId) => {
  const result = await Contact.findOneAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true },
  );
  return result;
};

const removeContact = async (id, userId) => {
  const result = await Contact.findOneAndRemove({
    _id: id,
    owner: userId,
  });
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
