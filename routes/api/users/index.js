const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/users');
const validate = require('./validation');
const guard = require('../../../helpers/guard');
const upload = require('../../../helpers/upload');

router.post('/auth/registration', validate.registerUser, userController.reg);
router.post('/auth/login', validate.loginUser, userController.login);
router.post('/auth/logout', guard, userController.logout);
router.get('/current', guard, userController.currentUser);
router.patch(
  '/',
  guard,
  validate.updateUserSub,
  userController.changeSubscription,
);
router.patch(
  '/avatars',
  [guard, upload.single('avatar'), validate.validateUploadAvatar],
  userController.avatars,
);

module.exports = router;
