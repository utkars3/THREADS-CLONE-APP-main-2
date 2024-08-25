import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';

const protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;           //jwt last me aaya kyuki isi naam s save this cookie
        if(!token) return res.status(401).json({message:"Unauthorized User"})

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.userId).select("-password");
        req.user=user;

        next();

    } catch (error) {
        console.log("Unauthorized User: ",error.message)
        return res.status(500).json({message:error.message})
    }
}

export default protectRoute;