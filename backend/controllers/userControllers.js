import userCollection from '../models/userCollection.js'
import postCollection from '../models/postCollection.js'
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(10);
import jwt from 'jsonwebtoken'
const JWT_SECRET = 'SocialApp'
import nodemailer from "nodemailer"
import randomstring from 'randomstring';
import { Verification_Email_Template } from "./EmailTemplates.js";


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name) {
            return res.status(401).json({ msg: "Name is required" })
        }

        if (!email) {
            return res.status(401).json({ msg: "Email is required" })
        }



        if (!password) {
            return res.status(401).json({ msg: "Password is required" })
        }

        let existingUser = await userCollection.findOne({ email })

        if (existingUser) {
            return res.status(401).json({ msg: "User already register" })
        }
        // password change
        let hashpassword = bcrypt.hashSync(password, salt)

        let data = await userCollection.insertOne({
            name: name,
            email: email,
            password: hashpassword
        })

        res.status(201).json({ msg: "User registered successfully" })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}


const loginUser = async (req, res) => {

    const { email, password } = req.body

    if (!email) {
        return res.status(401).json({ msg: "Email is required" })
    }

    if (!password) {
        return res.status(401).json({ msg: "Password is required" })
    }

    let existingUser = await userCollection.findOne({ email })

    if (existingUser) {
        let comparePassword = bcrypt.compareSync(password, existingUser.password)
        if (comparePassword) {
            let token = await jwt.sign({ _id: existingUser._id }, JWT_SECRET)
            res.status(200).json({ msg: "User log in succesfully", user: existingUser, token })
        } else {
            res.status(401).json({ msg: "Incorrect Password" })
        }


    } else {
        res.status(401).json({ msg: "User not found please register" })
    }


}

const getAllUser = async (req,res)=>{
  try {
    const {_id} = req.user;
    const user = await userCollection.find({ _id: { $ne: _id } }).select('-password');
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getLoggedInUser = async(req,res)=>{
   try {
     const {_id} = req.user;
    let user = await userCollection.findById(_id).select('-password');
    res.status(200).json({user})
   } catch (error) {
    res.status(500).json({error:error.message})
   }
}

const updateUser = async (req, res) => {

    try {
        // console.log('req.user = ',req.user )
        const { _id } = req.user
        const { name, password, coverPic, profilePic } = req.body

        if (password) {
            var hashpassword = bcrypt.hashSync(password, salt)
        }
        let user = await userCollection.findByIdAndUpdate(_id,{ name, password: hashpassword, coverPic, profilePic },{ new: true })

        res.status(200).json({ msg: "user update successfully",user})


    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
    // const token  = req.headers.authorization
    // const {name ,password }= req.body
    // console.log('token =', token)

    // let decoded = jwt.verify(token,JWT_SECRET)
    // console.log(decoded)

}
const deleteUser = async (req, res) => {

    try {
        const { _id } = req.user

        let user = await userCollection.findByIdAndDelete(_id)
        res.status(200).json({ msg: "user deleted successfully" })


    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await userCollection.findOne({ email })
        // console.log(user)
        if (!user || null) {
            return res.status(401).json({ msg: "User not found " });
        }



        let resetToken = randomstring.generate(40);
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000; //10min
        //    console.log(user.resetPasswordTokenExpires)
        await user.save()
        let verificationEmail = `http://localhost:9000/user/resetPassword/${resetToken}`;
        let userName = user.name;

        let htmlContent = Verification_Email_Template.replace("{userName}", userName).replace("{verificationEmail}", verificationEmail);

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "reelmates8@gmail.com",
                pass: "yegp opkn ndkt rlxd",
            },
        });
        // Wrap in an async IIFE so we can use await.
        (async () => {
            const info = await transporter.sendMail({
                from: 'reelmates8@gmail.com',
                to: email,
                subject: "Reset Password Request",
                // text: `Please click the link below to update password \n http://localhost:9000/user/resetPassword/${resetToken}`, // plain‑text body
                html: htmlContent,
            });
            // console.log(email);
            // console.log(verificationEmail)
            // console.log("Message sent:", info.messageId);
        })();
        res.status(200).json({ msg: 'Please check your email for the reset link. ' });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const resetPassword = async (req, res) => {

    try {
        const { resetToken } = req.params
        // console.log(resetToken)
        let user = await userCollection.findOne({ resetPasswordToken: resetToken, resetPasswordTokenExpires: { $gt: Date.now() } });
        if (user) {
            res.render('passwordResetPage', { resetToken })
        }
        else {
            res.status(401).json({ msg: "Expire token" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const updatePassword = async (req, res) => {

    try {
        const { password } = req.body
        const { resetToken } = req.params

        let user = await userCollection.findOne({ resetPasswordToken: resetToken });

        if (user) {

            let hashpassword = bcrypt.hashSync(password, salt)

            user.password = hashpassword;
            user.resetPasswordToken = null
            user.resetPasswordTokenExpires = null;
            await user.save()

            res.status(200).json({ msg: "Password update succesfully" })
        }
        else {
            res.status(401).json({ msg: "token expired" })
        }

    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

const getSearch = async (req, res) => {
    try {
        const { name } = req.query
        if (name.length > 0) {
            let user = await userCollection.find({ name: new RegExp(name) })
            res.status(200).json(user)

        }
        else {
            res.status(200).json([])
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}
const getFirend = async (req, res) => {

    try {
        const { friendId } = req.params;
    const friend = await userCollection.findById(friendId).select('-password -resetPasswordToken -resetPasswordTokenExpires -createdAt -updatedAt ')
    let friendPosts = await postCollection.find({ userId: friendId }).populate({ path: 'userId', select: 'name profilePic' }).populate({
        path: 'likes', select: 'name profilePic'}).populate({ path: "comment", populate: { path: 'userId', select: 'name profilePic' } })
    
    res.status(200).json({ msg: "data fetched successfully", friend, friendPosts });
        
    } catch (error) {
        res.status(500).json({ error: error.message})
    }

}

const followUnfollow= async(req,res)=>{
    try {
        const {_id}=req.user;
        const friendId = req.params.friendId;
        let user = await userCollection.findById(_id)
        let friend = await userCollection.findById(friendId)

        if(user.followings.includes(friendId) && friend.followers.includes(_id)){
            user.followings.pull(friendId);
            friend.followers.pull(_id);
            await user.save()
            await friend.save()
            res.status(200).json({msg:"User unfollow successfully"})
        }
        else{
             user.followings.push(friendId);
            friend.followers.push(_id);
            await user.save()
            await friend.save()
            res.status(200).json({msg:"User follow successfully"})

        }

    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}




export {
    registerUser,
    loginUser,
    getAllUser,
    updateUser,
    deleteUser,
    forgetPassword,
    resetPassword,
    updatePassword,
    getSearch,
    getFirend,
    followUnfollow,
    getLoggedInUser
}