import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get channel stats: total videos, total subscribers, total likes, total views
const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user?._id;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Total videos
    const totalVideos = await Video.countDocuments({ user: channelId });

    // Total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    // Total likes on all videos
    const videoIds = await Video.find({ user: channelId }).distinct("_id");
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

    // Total views (assuming you have a 'views' field in Video model)
    const videos = await Video.find({ user: channelId }, "views");
    const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);

    res.status(200).json(new ApiResponse(200, {
        totalVideos,
        totalSubscribers,
        totalLikes,
        totalViews
    }, "Channel stats fetched successfully"));
});

// Get all videos uploaded by the channel
const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user?._id;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const videos = await Video.find({ user: channelId }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export {
    getChannelStats,
    getChannelVideos
}