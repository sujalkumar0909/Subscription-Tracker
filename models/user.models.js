import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'User name required'],
        trim:true,
        minlength:2,
        maxLength:50,
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Corrected regex
          'Please enter a valid email address (e.g., user@example.com)'
        ]
      },
    password:{
        type:String,
        required:[true,'User password is required'],
        minlength:6,
    }
},{timestamps:true});

const User=mongoose.model('User',userSchema);

export default User;