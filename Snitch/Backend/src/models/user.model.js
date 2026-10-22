import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    email: { type: string, required: true , unique:true },
    contact: { type: string , required: true },
    password: { type: string, required: true },
    fullName: { type: string, required: true },
    role: {
        type: String,
        enum: ["buyer","seller"],
        default: "buyer"
    },
    
})


// hashing password before saving
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
})

//method to compare password
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("user", userSchema);
export default userModel;