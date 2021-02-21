const Joi = require('joi');

const schemaAddContact = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.string()
    .pattern(/[\d]{3}[-][\d]{7}/)
    .required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(2).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .optional(),
  phone: Joi.string()
    .pattern(/[\d]{3}[-][\d]{7}/)
    .optional(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    console.log(error);
    const [{ message }] = error.details;
    return next({
      status: 400,
      message: `Field ${message.replace(/"/g, '')}`,
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
