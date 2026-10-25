import User from "../model/auth.model.js"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerUser = async(req, res)=>{
    try {
        const {name, email, password, domain, skills} = req.body
        if(!name || !email || !password) {
            return res.status(400).json({
                success : false,
                message : "All Fields are Required"
            })
        }
        if(password.lenght < 8) {
            return res.status(400).json({
                success : false,
                message : "Password should be 8 char"
        })
    }
    const exituser = await User.findOne({email})
    if(exituser) {
        return res.status(400).json({
                success : false,
                message : "User already exist"
    
            })
        } 
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            domain,
            skills
        })
        return res.status(201).json({
            success : true,
            message : "User Created Succesfully",
            user
        })
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            success : true,
            message : "Internal server error",
    
        })
    }
}

export const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email}).select('+password')

        if(!user){
            return res.status(400).json({
            success : true,
            message : "Invalid User and Password"
        })
    } 
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        return res.status(400).json({
            success : false,
            message : "Invalid Password"
        })
    }
    const token = jwt.sign({userID : user._id},process.env.JWT_SECRET)
    return res.status(200).json({
            success : true,
            message : "Login Successful",
            user,
            token
        })
    } catch(e) {
        return res.status(500).json({
            success : false,
            message : "Internal server error",
        })
    }
}