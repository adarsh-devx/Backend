const express = require('express')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const authRouter = express.Router()


authRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body

    const isUserAlreadyExist = await userModel.findOne({email})

    if(isUserAlreadyExist){
        return res.status(409).json({
            message: `User already exist with this ${email}`,
        })
    }


    const hash = crypto.createHash('md5').update(password).digest('hex')

    const user = await userModel.create({
        name, email, password: hash
    })


    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET
    )


    res.cookie(
        'jwt_token',
        token
    )


    

    res.status(201).json({
        message: 'user register successfully',
        user,
        token
    })
})


authRouter.post('/login' , async (req , res) => {
    const {email , password} = req.body;

    const user = await userModel.findOne({email})

    if(!user ){
        return res.status(400).json({
            message: 'User Not Found with this email address'
        })
    }

    const isPasswordMatch =  user.password === crypto.createHash('md5').update(password).digest('hex')

    if(!isPasswordMatch){
        return res.status(401).json({
            message: 'Invalid Password'
        })
    }

    const token = jwt.sign({
        id: user._id
    } , process.env.JWT_SECRET)

    res.cookie('jwt_token', token)

    res.status(200).json({
        message: "user logged in",
        user
    })
    

    

    
})



module.exports = authRouter