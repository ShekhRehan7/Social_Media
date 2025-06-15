import mongoose from "mongoose";

const connectToDb =async()=>{
    
    try {
        await mongoose.connect('mongodb://localhost:27017/socialMedia')
        console.log('Mongodb connected successfully')
    } catch (error) {
        console.log('error in connecting mongodb')
    }
}

export default connectToDb;