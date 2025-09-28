import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle like on a video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existing = await Like.findOne({ video: videoId, user: userId });
    if (existing) {
        await Like.deleteOne({ _id: existing._id });
        return res.status(200).json(new ApiResponse(200, null, "Video unliked"));
    } else {
        await Like.create({ video: videoId, user: userId });
        return res.status(201).json(new ApiResponse(201, null, "Video liked"));
    }
});

// Toggle like on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existing = await Like.findOne({ comment: commentId, user: userId });
    if (existing) {
        await Like.deleteOne({ _id: existing._id });
        return res.status(200).json(new ApiResponse(200, null, "Comment unliked"));
    } else {
        await Like.create({ comment: commentId, user: userId });
        return res.status(201).json(new ApiResponse(201, null, "Comment liked"));
    }
});

// Toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existing = await Like.findOne({ tweet: tweetId, user: userId });
    if (existing) {
        await Like.deleteOne({ _id: existing._id });
        return res.status(200).json(new ApiResponse(200, null, "Tweet unliked"));
    } else {
        await Like.create({ tweet: tweetId, user: userId });
        return res.status(201).json(new ApiResponse(201, null, "Tweet liked"));
    }
});

// Get all liked videos for a user
const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const likes = await Like.find({ user: userId, video: { $exists: true } }).populate("video");
    const videos = likes.map(like => like.video);

    res.status(200).json(new ApiResponse(200, videos, "Liked videos fetched successfully"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}