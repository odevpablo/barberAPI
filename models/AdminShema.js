import mongoose from "mongoose";


const adminshema = new mongoose.Schema(
    {
        id:mongoose.Schema.Types.ObjectId,
        name:{
            type: String,
            require: true,
        }
        password:{
            type: String, 
            require: true,
        }
    }
);