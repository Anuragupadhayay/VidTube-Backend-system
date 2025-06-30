/*
Owner ObjectId users
videoFile string
thumbnail string
title string
desciption string
isPublished boolean
createdAt Date
updatedAt Date
*/
import mongoose, { SchemaType } from "mongoose";
const videoSchema = new Schema({
  videoFile: {
    type: String, //Cloudinary URl
    required: true,
  },
  thumbnail: {
    type: String, //Cloudinary URl
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String, //Cloudinary URl
    required: true
  },
  Duration: {
    type: Number,
    required: true
  },
  views: {
    type: Number,
    required: true,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  owner: {
    type: Schema.Types.objectId,
    ref: "User"
  }
}, {timestamps: true})


export const Video = mongoose.model("Video", videoSchema)