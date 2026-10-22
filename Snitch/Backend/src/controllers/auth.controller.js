import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js";


async function sendTokenResponse(user , res , message){
    const token = jwt.sign({
        id: user._id,    
    }, config.JWT_SECRET,{
        expiresIn: "10d"
    })

    res.cookie("token", token)




    res.status(200).json({
        message,
        success: true,
        user: {
            _id: user._id,
            email: user.email,
            contact: user.contact,
            fullName: user.fullName,
            role: user.role
        }
    })
} 



export const registerUser = async (req,res)=>{
    const {email,contact,password,fullName,isSeller} = req.body;
    try {
        //check if user already exists
        const existingUser = await userModel.findOne({
            $or: [{email}, {contact}]
        });
        if(existingUser){
            return res.status(400).json({message:"User with Email or Contact already exists"})
        }

        //create user
        const user = await userModel.create({
            email,
            contact,
            password,
            fullName,
            role: isSeller ? "seller" : "buyer"
        })

        return sendTokenResponse(user , res, "User registered successfully")
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
}