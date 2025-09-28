import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all comments for a video (with pagination)
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const comments = await Comment.find({ video: videoId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("user", "name email");

    const total = await Comment.countDocuments({ video: videoId });

    res.status(200).json(new ApiResponse(200, { comments, total }, "Comments fetched successfully"));
});

// Add a comment to a video
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
        video: videoId,
        user: userId,
        content
    });

    res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"));
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }
    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.findOneAndUpdate(
        { _id: commentId, user: userId },
        { content },
        { new: true }
    );

    if (!comment) {
        throw new ApiError(404, "Comment not found or unauthorized");
    }

    res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"));
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findOneAndDelete({ _id: commentId, user: userId });

    if (!comment) {
        throw new ApiError(404, "Comment not found or unauthorized");
    }

    res.status(200).json(new ApiResponse(200, comment, "Comment deleted successfully"));
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}