import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { json } from "express";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
    if(!user){
        throw new Error("User not found!");
    }
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
    return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
}

const registerUser = asyncHandler( async (req, res) => {
    const {fullname, email, username, password} = req.body
    //validation

    if(
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already existed")
    }
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverLocalPath = req.files?.coverImage?.[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }
    // const avatar = await uploadOnCloudinary(avatarLocalPath)
    // let coverImage = ""
    // if (coverLocalPath){
    //     coverImage = await uploadOnCloudinary(coverImage)
    // }

    let avatar;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath)
        console.log("Uploaded avatar", avatar);
        
    } catch (error) {
        console.log("error uploading avatar", error);
        throw new ApiError(500, "Failed to upload avatar")
    }

    let coverImage;
    try {
        coverImage = await uploadOnCloudinary(coverLocalPath)
        console.log("Uploaded avatar", coverImage);
        
    } catch (error) {
        console.log("error uploading cover image", error);
        throw new ApiError(500, "Failed to upload cover image")
    }

    try {
        const user = await User.create({
        fullname,
        avatar: avatarLocalPath,
        coverImage: coverLocalPath || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    if(!createdUser){
        throw new ApiError(500, "Something went wrong while regitering a user")
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"))
    } catch (error) {
        console.log("User creation failed");
    }
    if(avatar){
        await deleteFromCloudinary(avatar.public_id)
    }
    if(coverImage){
        await deleteFromCloudinary(coverImage.public_id)
        throw new ApiError(500, "Something went wrong while registering a user and images are deleted");        
    }
})

const loginUser = asyncHandler( async (req, res)=> {
    const {email, username, password} = req.body
    //validation
    if(!email){
        throw new ApiError(500, "email is required !");
    }
    if(!username){
        throw new ApiError(500, "username is required !");
    }
    if(!password){
        throw new ApiError(500, "password is required !");
    }
    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404, "User not found!");        
    }
    //validate password

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Incorrect Password!");        
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
    
    if(!loggedInUser){
        throw new ApiError(500,"Failed to Login");        
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }
    return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", refreshToken, options)
     .json (new ApiResponse(
        200,
        {user: loggedInUser, accessToken, refreshToken},
        "User logged in successfully"
     ))
})

const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {new: true}
    )


    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }
    return res
      .status(200)
      .clearCookie("accessToekn", options)
      .clearCookie("refreshToken", options)
      .json( new ApiResponse (200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh token is required")
    }
    try {
       const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
       ) 
       const user = await User.findById(decodedToken?._id)
       if(!user) {
        throw new ApiError(401,"Invalid Refresh Token")
       }
       if( incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, "Invalid refresh token")
       }

       const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
       }

       const {accessToken, refreshToken: newRefreshToken} = await generateRefreshToken(user._id)

       return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Access token refreshed successfully"
            )
        )
    } catch (error) {
        
    }
})

const changeCurrentPassword = asyncHandler( async (req, res) => {
    const {oldPassword, newPassword} = req.body
    await User.findById(req.user?._id)
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordValid){
        throw new ApiError(401, "Old password is incorrect")
    }
    user.password = newPassword;

    await user.save({ validateBeforeSave: false})

    return res.status(200).json( new ApiResponse(200, "Password changed successfully!"))
})

const getCurrentUser = asyncHandler( async (req, res) => {
    res.status(200).json( new ApiResponse(200, req.user, "Current User details"))
})

const updateAccountDetails = asyncHandler( async (req, res) => {
    const {fullname, email} = req.body

    if(!fullname || !email){
        throw new ApiError(400, "Fullname and email are required")
    }

    User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email: email
            }
        }, {new: true}
    ).select("-password -refreshToken")
    
    return res.status(200).json ( new ApiResponse(200, user, "Account details updated successfully"))
})  

const updateUserAvatar = asyncHandler( async (req, res) => {
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(401,"File is reqiured");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(500, "Somthing went wrong while uploading the avatar")
    }
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        }, { new: true}
    ).select("-password -refreshToken")

    res.status(200).json( new ApiResponse(200, user, "Avatar updated successfully"))
})

const updateUserCoverImage = asyncHandler( async (req, res) => {
     const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(401,"File is reqiured");
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage.url){
        throw new ApiError(500, "Somthing went wrong while uploading the Cover Image")
    }
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        }, { new: true}
    ).select("-password -refreshToken")

    res.status(200).json( new ApiResponse(200, user, "Cover Image updated successfully"))
})

const getUserChannelProfile = asyncHandler( async (req, res) => {
    const {username} = req.params

    if(!username?.trim()){
        throw new ApiError(400, "Username is required")
    }

    const channel = await User.aggregate(
        [
            {
                $match: {
                    username: username?.toLowerCase()
                }
            },
            {
                $lookup: {
                    from: "subscription",
                    localField: "id",
                    foreignField: "channel",
                    as: "Subscribers"
                }
            },
            {
                $lookup: {
                    from: "subscription",
                    localField: "_id",
                    foreignField: "Subcriber",
                    as: "subscribedTo"
                }
            },
            {
                $addFields: {
                    subscribersCount: {
                        $size: "$Subscribers"
                    },
                    channelSubscribedToCount: {
                        $size: "$subcribedTo"
                    },
                    isSubscribed: {
                        $cond: {
                            if: {$in: [req.user?._id, "$subscribers", "$subscribedTo"]},
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                //project only the necessary data
                $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                    subscribersCount: 1,
                    channelSubscribedToCount: 1,
                    isSubscribed: 1,
                    coverImage: 1,
                    email: 1
                }
            }
        ]
    )
    if(!channel?.length){
        throw new ApiError(400, "channel not found")
    }

    return res.status(200).json( new ApiResponse(
        200,
        channel[0],
        "Channel profile fetched successfully"
    ))
})

const getWatchHistory = asyncHandler( async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                    fullname: 1,
                                    username: 1,
                                    avatar: 1
                                }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, user[0]?.watchHistory, "Watch history fetched successfully"))
})

export { 
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getWatchHistory,
    getUserChannelProfile
}