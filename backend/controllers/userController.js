import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import {v2 as cloudinary} from 'cloudinary';
import mongoose from "mongoose";
import Post from "../models/postModel.js";




export const getUserProfile=async(req,res)=>{
    const {query}=req.params;
    //we will fetch user profile either with username or userid
    //query is either username or userid
    try {

        let user;
        //query is userid
        if(mongoose.Types.ObjectId.isValid(query)){
            user=await User.findOne({_id:query}).select("-password").select("-updatedAt");
        }else{
            //by username
            user=await User.findOne({username:query}).select("-password").select("-updatedAt");
        }

       
        if(!user){
        return res.status(200).json({ error: "User not found"})
        
    }
    return res.status(200).json(user)
    } catch (error) {
        console.log("Error in getuserprofile: ", error.message)
        return res.status(500).json({ error: error.message })
    }
}
//signup user
export const signupUser = async (req, res) => {
   
    try {
        console.log(req.body)
        const { name, email, username, password } = req.body       //we are able to get all these because of express.json middlewares
        const user = await User.findOne({ $or: [{ email }, { username }] });   //username ya email match kia to

        if (user) {
            return res.status(400).json({ error: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name, email, username, password: hashedPassword
        })
        await newUser.save();

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            return res.status(400).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                // bio:"",
                // profilePic:user.profilePic,
            })
        } else {
            return res.status(400).json({ error: "invalid user data" })
        }

    } catch (error) {
        console.log("Error in signupUser: ", error.message)
        return res.status(500).json({ error: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        console.log("Entered login")
        const { username, password } = req.body
       
        const user = await User.findOne({ username })

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")    //because if user not exists.how we can compare password thats why question mark.also question mark will return null and bcrypt cannot compare with null so in case of null we have provided empty strring
        if (!user) {
            return res.status(400).json({ error: "Invalid username" })
        }

        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio:user.bio,
            profilePic:user.profilePic,

        })

    } catch (error) {
        console.log("Error in loginUser: ", error.message)
        return res.status(500).json({ error: error.message })
    }
}


export const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 })      //this will remove jwt cookie from response within 1 ms
        return res.status(200).json({ message: "User logged out successfully" })

    } catch (error) {
        console.log("Error in logging out: ", error.message)
        return res.status(500).json({ error: error.message })
    }
}


export const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(500).json({ error: "You cannot follow/unfollow yourself" })
        }
        if (!userToModify || !currentUser) return res.status(500).json({ error: "User not found" })

        const isFollowing = currentUser.following.includes(id)     //check already following or not
        if (isFollowing) {
            //unfollow user
            //remove currentuser from followers of usertomodify
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
            //remove usertomodify from following of currentuser
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
            return res.status(200).json({ message: "User unfollowed successfully" })


        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
            return res.status(200).json({ message: "User followed successfully" })

        }

    } catch (error) {
        console.log("Error in follow/unfollow: ", error.message)
        return res.status(500).json({ error: error.message })
    }
}



export const updateUser = async (req, res) => {
    
        const { name, email, username, password, bio } = req.body;
        let {profilePic}=req.body;
        const userId = req.user._id;
        try {
            let user = await User.findById(userId);
            if (!user) return res.status(400).json({ error: "user not found" })

            if(req.params.id!==userId.toString()) return res.status(400).json({ error:"You cannot update other user profile"})


            if (password) {           //updating password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                user.password = hashedPassword;
            }

            if(profilePic){
                if(user.profilePic){
                    await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])       //for removing the old image from cloudinary
                }

                const uploadedResponse=await cloudinary.uploader.upload(profilePic);
                profilePic=uploadedResponse.secure_url;                                     // for uploading file to cloudinary database
            }

            user.name = name || user.name
            user.email = email || user.email
            user.username = username || user.username
            user.profilePic = profilePic || user.profilePic
            user.bio = bio || user.bio

            user = await user.save();

            //find all posts that this user replied and update username and  userprofilepics fields
            await Post.updateMany(
                {"replies.userId":userId},
                {
                    $set:{
                        "replies.$[reply].username":user.username,
                        "replies.$[reply].userProfilePic":user.profilePic
                    }
                },
                {arrayFilters:[{"reply.userId":userId}]}
            )

            //password should be null in response
            user.password=null;
            return res.status(200).json(user)

            
        
    } catch (error) {
        console.log("Error in update user ", error.message)
        return res.status(500).json({ error: error.message })
    }
}

