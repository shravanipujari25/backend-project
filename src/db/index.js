import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB=async()=>{
   try{
      const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      console.log(`MONGODB connected!! DB host:${connectionInstance.connection.host }`);
   }
catch(error){
    console.log("MONGODB Connection Error",error);
    throw error;
   // process.exit(1);
}
}

