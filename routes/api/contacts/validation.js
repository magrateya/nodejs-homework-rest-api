const Joi = require('joi');

const schemaAddContact = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  phone: Joi.string()
    .pattern(/[\d]{3}[-][\d]{7}/)
    .required(),
  subscription: Joi.string().optional(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(2).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .optional(),
  phone: Joi.string()
    .pattern(/[\d]{3}[-][\d]{7}/)
    .optional(),
  subscription: Joi.string().optional(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  console.log(obj);
  if (error) {
    console.log(error);
    const [{ message }] = error.details;
    const messageText =
      Object.keys(obj).length === 0
        ? 'Missing fields'
        : `Field ${message.replace(/"/g, '')}`;
    return next({
      status: 400,
      message: messageText,
    });
  }
  next();
};

module.exports.addContact = (req, res, next) => {
  return validate(schemaAddContact, req.body, next);
};

module.exports.updateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};
