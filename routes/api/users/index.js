const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/users');
const validate = require('./validation');
const guard = require('../../../helpers/guard');

router.post('/auth/registration', validate.registerUser, userController.reg);
router.post('/auth/login', validate.loginUser, userController.login);
router.post('/auth/logout', guard, userController.logout);

module.exports = router;
