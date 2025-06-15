import mongoose from "mongoose";

let userSchema =new mongoose.Schema({
    name:{
        type:String,
        minLength:2,
        maxLength:100,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true})

userSchema.add({
    resetPasswordToken:{
        type:String,
        default:null
        
    },
    resetPasswordTokenExpires: {
    type: Date,
    default: null,
   },
   profilePic:{
        type:String,
        default:"https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
    },

    coverPic:{
        type:String,
        default:"https://wallpapercave.com/wp/wp2657869.jpg"
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    ],
    followings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    ]
})

// const users = mongoose.model('collection name', structure)
const users = mongoose.model('users',userSchema)

export default users;