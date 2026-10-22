import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js";


async function sendTokenResponse(user , res){
    const token = jwt.sign({
        id: user._id,    
    }, config.JWT_SECRET,{expiresIn: "10d"})
} 



export const registerUser = async (req,res)=>{
    const {email,contact,password,fullName} = req.body;
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
            fullName
        })
        return res.status(201).json({message:"User registered successfully", user})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
}