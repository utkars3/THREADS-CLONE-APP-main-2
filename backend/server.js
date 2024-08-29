import express from 'express'
import dotenv from "dotenv"
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import {v2 as cloudinary} from 'cloudinary';
import cors from 'cors';
          


dotenv.config()
connectDB();
  
const app=express();
app.use(cors())

const PORT=process.env.PORT || 5001

cloudinary.config({                                             //cloudinary connect logic
    cloud_name: 'duxyldydh', 
    api_key: '749189587955311', 
    api_secret: 'njXLiDJWbvDU6pP4J-qXZZOztzk' 
  });


app.use(express.json({limit:"50mb"}));            //it allows to parse incoming data from request body, kyuki ye image ko jaida payload bata rha tha isiliye limit badha die hai
app.use(express.urlencoded({extended:false}))           //url encoded is used to parse form data in the req.body 
app.use(cookieParser())                             //get cookie from request and send cookie inside response

app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);


app.listen(5001,()=>console.log(`Server started at http://localhost:${PORT}`));


