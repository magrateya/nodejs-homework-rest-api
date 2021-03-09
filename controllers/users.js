const jwt = require('jsonwebtoken');
const Users = require('../model/users');
const fs = require('fs').promises;
const path = require('path');
const Jimp = require('jimp');
const { HttpCode } = require('../helpers/constants');
const createFolderIsExist = require('../helpers/create-dir');
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
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isPasswordValid = await user?.validPassword(password);
    if (!user || !isPasswordValid) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Invalid credentals',
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '4h' });
    await Users.updateToken(id, token);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  const id = req.user.id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const currentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

const changeSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.updateSubscription(userId, req.body);

    return res.json({
      status: 'Success',
      code: HttpCode.OK,
      message: 'Users subscription has just updated',
      data: {
        user,
      },
    });
  } catch (e) {
    next(e);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const avatarUrl = await saveAvatarToStatic(req);
    await Users.updateAvatar(id, avatarUrl);
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        avatarUrl,
      },
    });
  } catch (e) {
    next(e);
  }
};

const saveAvatarToStatic = async req => {
  const id = req.user.id;
  const USERS_AVATARS = process.env.USERS_AVATARS;
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
  const img = await Jimp.read(pathFile);
  await img
    .autocrop()
    .cover(200, 200, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  await createFolderIsExist(path.join(USERS_AVATARS, id));
  await fs.rename(pathFile, path.join(USERS_AVATARS, id, newNameAvatar));
  const avatarUrl = path.normalize(path.join(id, newNameAvatar));
  try {
    await fs.unlink(path.join(process.cwd(), USERS_AVATARS, req.user.avatar));
  } catch (e) {
    console.log(e.message);
  }
  return avatarUrl;
};

module.exports = {
  reg,
  login,
  logout,
  currentUser,
  changeSubscription,
  avatars,
};
