import { Router } from "express";
import {validateRegisterUser} from "../validator/auth.validator.js"
import {registerUser} from "../controllers/auth.controller.js"


const router = Router()

router.post('/register',validateRegisterUser, registerUser)

export default router