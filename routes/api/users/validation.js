const Joi = require('joi');
const { HttpCode } = require('../../../helpers/constants');

const schemaRegisterUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  password: Joi.string().min(6).max(30).required(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  password: Joi.string().min(6).max(30).required(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  console.log(obj);
  if (error) {
    console.log(error);
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `${message.replace(/"/g, '')}`,
    });
  }
  next();
};

module.exports.registerUser = (req, res, next) => {
  return validate(schemaRegisterUser, req.body, next);
};

module.exports.loginUser = (req, res, next) => {
  return validate(schemaLoginUser, req.body, next);
};
