const jwt = require('jsonwebtoken');
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

const reg = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email is already use',
      });
    }
    const newUser = await Users.create(req.body);

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {};

const logout = async (req, res, next) => {};

module.exports = {
  reg,
  login,
  logout,
};
