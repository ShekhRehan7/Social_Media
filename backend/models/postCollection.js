import { text } from "express";
import mongoose from "mongoose";

let postSchema =new mongoose.Schema({
     title:{
        type:String,
    },
    files:[],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
   
},{timestamps:true})


postSchema.add({
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    ],
    comment:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'users'
            },
            text:{
                type:String
            },
            createdAt:{
                type:Date,
                default:Date.now
            }
        }
    ]
})

const post = mongoose.model('post',postSchema);

export default post