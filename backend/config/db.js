import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();



const connectToDb =async()=>{
    
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Mongodb connected successfully')
    } catch (error) {
        console.log('error in connecting mongodb')
    }
}

export default connectToDb;