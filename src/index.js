// require ('dotenv').config({path: './env' })
import dotenv from "dotenv"
import {connectDB} from "./db/index.js"

dotenv.config({
    path:'./env'
})


connectDB()
.then(()=>{
app.listen(process.env.PORT||8000,()=>{
console.log(`PORT is listening on localhost:${process.env.PORT}`);
})
})
.catch((error)=>{
    console.log("MONGODB connection failed",error);
})
















/*
import express from "express"
const app=express()

(async()=>{
    try{
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      app.on("error",()=>{
        console.log("error",error);
        throw err;

      });
    
    app.listen(process.env.PORT,()=>{
        console.log("app is listing on port :",process.env.PORT);
    })
}
    catch(error){
        console.error("ERROR",error);
        throw err

    }
}) ()
    */