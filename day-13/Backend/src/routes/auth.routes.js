const { Router } = require("express");
const {registerUser , loginUser , getMe} = require("../controller/auth.controller.js")
const authMiddleware = require("../middlewares/auth.middleware.js")
const router = Router();


router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/get-me' ,authMiddleware, getMe)

router.get('/logout' , logoutUser)






module.exports = router;