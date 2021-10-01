import express from 'express';
import  {UserController} from '../controllers/userController';
import  {userAuth} from '../middlewares/userAuth'
const router = express.Router();

router.post('/register', UserController.registerNewUser);
router.post('/login', UserController.signInUser);
router.patch('/activate/:userId', UserController.emailAvtivateUser);
router.patch('/deactivate/:userId', UserController.userAccountDeactivation);
router.post('/request-reset-password-link', UserController.requestResetPasswordLink)
router.patch('/update-user-passowrd', UserController.setNewPassword)

export default router;

