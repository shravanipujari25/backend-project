import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new tweet
export const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const userId = req.user?._id; // Assuming user is attached to req by auth middleware

    if (!content) {
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.create({ content, user: userId });
    res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

// Get all tweets for a user
export const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const tweets = await Tweet.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

// Update a tweet
export const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findOneAndUpdate(
        { _id: tweetId, user: userId },
        { content },
        { new: true }
    );

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or unauthorized");
    }

    res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

// Delete a tweet
export const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findOneAndDelete({ _id: tweetId, user: userId });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or unauthorized");
    }

    res.status(200).json(new ApiResponse(200, tweet, "Tweet deleted successfully"));
});