import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
    const uploadOnCloudinary = async (localFilePath) => {
       try {
        if(!localFilePath) return null 
        const response = await cloudinary.uploader.upload(
            localFilePath, {
                resource_type: "auto"
            }
        ) 
        console.log("File Uploaded on Cloudinary. File src: " + resource.url);
        //once the file is uploaded, we would like to delete it from our server
        fs.unlinkSync(localFilePath)
        return response
       } catch (error) {
          fs.unlinkSync(localFilePath)
          return
       }
    } 

    export { uploadOnCloudinary }
