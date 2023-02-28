import {Router} from 'express'
import { AuthUser } from '../../middleware/AuthUser.js';
import * as authController from  './controller/auth.js'
import { LoginSchema, signUpSchema } from "./ValidationUser.js";
import { validation } from '../../utils/Validation.js';
const router = Router();


router.get("/" , authController.getAuthModule)
router.post("/register" ,validation(signUpSchema), authController.register)
router.post("/login" , validation(LoginSchema),authController.login)
router.put("/resetpassword" , AuthUser,authController.resetpassword)
router.post("/sendingemail" , authController.sendingemail)
router.post('/reset-password/:id/:token',authController.userPasswordResetGen)

export default  router