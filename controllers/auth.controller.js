import mongoose from "mongoose"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import User from '../models/user.models.js'

export const signup = async (req, res, next) => {
    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            throw new Error("User already exists");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword
        }], { session });

        // Generate JWT
        const token = jwt.sign(
            { userId: newUsers[0]._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // SUCCESS: Commit and respond
        await session.commitTransaction();
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                User: newUsers[0]
            }
        });

    } catch (error) {
        // FAILURE: Abort transaction
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        
        // Set proper error code for duplicate email
        if (error.message.includes("E11000")) {
            error.statusCode = 409;
            error.message = "User already exists";
        } else if (!error.statusCode) {
            error.statusCode = 500;
        }
        
        next(error);
    } finally {
        // Always end session
        session.endSession();
    }
};

export const signin=async(req,res,next)=>{
    try{

        const{email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            const error=new Error("User not Found");
            error.statusCode=404;
            throw error;
        }
        const isPasswordValid=await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
            const error=new Error("Invalid password");
            error.statusCode=401;
            throw error;
        }
        const token=jwt.sign({userid:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

        res.status(200).json({
            success:true,
            message:'User signed in successfully',
            data:{
                token,
                user
            }
        })
    }catch(error){
        next(error);
    }
}

export const signOut=async(req,res,next)=>{}