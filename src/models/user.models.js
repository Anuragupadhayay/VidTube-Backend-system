import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
 const userSchema = new Schema({
    username:{
        type: String,
        required :true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required :true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        required :true,
        unique: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary URl
        required: true
    },
    coverImage: {
        type: String //cloudinary URl
    },
    watchHistory: [
       {
        type: Schema.Types.ObjectId,
        ref: "Video"
       }
    ],
    password: {
        type: String,
        required: [true, "password is required"],
    },
    refreshToken: {
        type: String
    }
 }, 
 { timestamps: true}
)


userSchema.pre("save", async function(next){
    
    if(!this.modified("password")) return next()
    
    this.password = bcrypt.hash(this.password, 10)

    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAcessToken = function (){
    //short lived access token
}


export const User = mongoose.model("User", userSchema)