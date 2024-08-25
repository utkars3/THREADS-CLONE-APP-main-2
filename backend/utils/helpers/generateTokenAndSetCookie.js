import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

const generateTokenAndSetCookie=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'15d',
    });

    res.cookie("jwt",token,{
        httpOnly:true,                       //this cookie will not be accessible by browser
        maxAge:15*24*60*60*1000,                 //15 days
        sameSite:"strict",                           //CSRF -- more secure

    })
    return token;
}
export default generateTokenAndSetCookie;