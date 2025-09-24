import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';


const registerUser=asyncHandler(async (req,res)=>{
    
    //get user details from frontend
    //validation -not empty
    //check if user already exists: username,email
    //check for images,check for avatar
    //upload on cloudinary
    //create user object -create entry in db
    //remove password and refresh token from response
    //check for user creation 
    //return res

    const {fullname,email,username,password}=req.body
    console.log("email :",email);

    if(fullname==""){
       throw new ApiError(400,"fullname is required")
    }
       if(email==""){
       throw new ApiError(400,"fullname is required")
    }
       if(username==""){
       throw new ApiError(400,"fullname is required")
    }
       if(password==""){
       throw new ApiError(400,"fullname is required")
    }

    const existedUser=User.findOne({
        $or:[{username},{email}]
    })
    
    if(existedUser){
    throw new ApiError(409,"user already exist");}

    const avatarLocalPath= req.files?.avatar[0]?.path;
        const coverImageLocalPath= req.files?.coverImage[0]?.path;

        if(!avatarLocalPath){
            throw new ApiError(400,"Avatar file is requied");
        }

      const avatar= await uploadOnCloudinary(avatarLocalPath);
      const coverImage=await uploadOnCloudinary(coverImageLocalPath);

      if(!avatar){
        throw new ApiError(400,"Avatar file is requied")
      }
      User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:toLowerCase()
      })

      const createdUser=await User.findById(user._id).select("-password -refreshToken")
      if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
      }
     return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
     )
 })


export{registerUser};
