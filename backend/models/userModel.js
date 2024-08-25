import mongoose from 'mongoose'

const userSchema =mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minLength:6,
        required:true,
    },
    profilePic:{
        type:String,
        default:""
    },
    followers:{
        type:[String],
        default:[]
    },
    following:{
        type:[String],
        default:[]
    },
    bio:{
        type:String,
        default:""
    },


},{
    timestamps:true,                    //for automatic timestamps
});

const User=mongoose.model('User',userSchema);       // convention to use singular inside brackets

export default User