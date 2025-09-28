import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get all videos with pagination, search, and sorting
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;
    const filter = {};
    if (query) {
        filter.title = { $regex: query, $options: "i" };
    }
    if (userId && isValidObjectId(userId)) {
        filter.user = userId;
    }
    const sort = {};
    sort[sortBy] = sortType === "asc" ? 1 : -1;

    const videos = await Video.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Video.countDocuments(filter);

    res.status(200).json(new ApiResponse(200, { videos, total }, "Videos fetched successfully"));
});

// Publish a new video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user?._id;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    if (!req.file) {
        throw new ApiError(400, "Video file is required");
    }

    // Upload video to Cloudinary
    const videoUpload = await uploadOnCloudinary(req.file.path, "video");
    if (!videoUpload?.secure_url) {
        throw new ApiError(500, "Video upload failed");
    }

    const video = await Video.create({
        title,
        description,
        url: videoUpload.secure_url,
        user: userId,
        thumbnail: videoUpload.thumbnail_url || "",
        published: true
    });

    res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

// Get video by ID
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

// Update video details
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, thumbnail } = req.body;
    const userId = req.user?._id;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findOneAndUpdate(
        { _id: videoId, user: userId },
        { title, description, thumbnail },
        { new: true }
    );

    if (!video) {
        throw new ApiError(404, "Video not found or unauthorized");
    }

    res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

// Delete video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findOneAndDelete({ _id: videoId, user: userId });

    if (!video) {
        throw new ApiError(404, "Video not found or unauthorized");
    }

    res.status(200).json(new ApiResponse(200, video, "Video deleted successfully"));
});

// Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findOne({ _id: videoId, user: userId });
    if (!video) {
        throw new ApiError(404, "Video not found or unauthorized");
    }

    video.published = !video.published;
    await video.save();

    res.status(200).json(new ApiResponse(200, video, "Video publish status toggled"));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}