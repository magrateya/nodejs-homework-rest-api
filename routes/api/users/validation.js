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

const schemaUpdateUserSub = Joi.object({
  subscription: Joi.string().valid('free', 'pro', 'premium').required(),
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

module.exports.updateUserSub = (req, res, next) => {
  return validate(schemaUpdateUserSub, req.body, next);
};

module.exports.validateUploadAvatar = (req, res, next) => {
  if (!req.file) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'Bad request',
      message: "Field 'avatar' with file is not found",
    });
  }
  next();
};
