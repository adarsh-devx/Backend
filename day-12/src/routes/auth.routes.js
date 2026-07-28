const express = require('express')
const authRouter = express.Router()


authRouter.post('/register' , async (req , res) => {
    const { username , email , password , bio , profileImage} = req.body;

    const isUserExistsByEmail = await userModel.findOne({email})
    

    if(isUserExistsByEmail){
        return res.status(409).json({message : "user already exists with same email"})
    }
    
    const isUserExistsByUsername = await userModel.findOne({username})

    if(isUserExistsByUsername){
        return res.status(409).json({message : "user already exists by username"})
    }

    try{
        const user = await userModel.create({
            username,
            email,
            password,
            bio,
            profileImage
        })
        res.status(200).json({message : "user registered successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({message : "internal server error"})
    }
})














module.exports = authRouter