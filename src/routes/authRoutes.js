const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();
const userAuth = require('../middlewares/userAuth')

router.post('/register', UserController.registerNewUser);
router.post('/login', UserController.signInUser);
router.patch('/activate/:userId', UserController.emailAvtivateUser);
router.patch('/deactivate/:userId', userAuth, UserController.userAccountDeactivation);
router.post('/request-reset-password-link', UserController.requestResetPasswordLink)
router.patch('/update-user-passowrd', UserController.setNewPassword)

module.exports = router;

