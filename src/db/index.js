import mongoose from "mongoose";
import { DB_name } from "../constants.js";


const connectDB = async () => {
    try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_name}`) 
      console.log(`\n MongoDB connected ! DB host: ${connectionInstance.connection.host}`);
       
    } catch (error) {
        console.log("MongoDB Connection error", error);
        
    }
}

export default connectDB
