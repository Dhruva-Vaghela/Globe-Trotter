"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunityFeed = getCommunityFeed;
exports.getPublicTripDetails = getPublicTripDetails;
exports.publishTrip = publishTrip;
exports.unpublishTrip = unpublishTrip;
exports.copyTrip = copyTrip;
exports.deleteCommunityPost = deleteCommunityPost;
const communityService_js_1 = require("../services/communityService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const AppError_js_1 = require("../utils/AppError.js");
async function getCommunityFeed(req, res, next) {
    try {
        const query = {
            search: req.query.search,
            city: req.query.city,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        };
        const feed = await communityService_js_1.CommunityService.getCommunityFeed(query);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Community feed retrieved successfully', feed);
    }
    catch (err) {
        next(err);
    }
}
async function getPublicTripDetails(req, res, next) {
    try {
        const { tripId } = req.params;
        const trip = await communityService_js_1.CommunityService.getPublicTripDetails(tripId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Public trip details retrieved successfully', trip);
    }
    catch (err) {
        next(err);
    }
}
async function publishTrip(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const result = await communityService_js_1.CommunityService.publishTrip(req.user.userId, tripId, req.body);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Trip published to community feed successfully', result);
    }
    catch (err) {
        next(err);
    }
}
async function unpublishTrip(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const result = await communityService_js_1.CommunityService.unpublishTrip(req.user.userId, tripId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Trip unpublished successfully', result);
    }
    catch (err) {
        next(err);
    }
}
async function copyTrip(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const newTrip = await communityService_js_1.CommunityService.copyTrip(req.user.userId, tripId);
        return (0, ApiResponse_js_1.sendResponse)(res, 201, 'Trip adopted and copied to your account successfully', newTrip);
    }
    catch (err) {
        next(err);
    }
}
async function deleteCommunityPost(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { id } = req.params;
        await communityService_js_1.CommunityService.deleteCommunityPost(req.user.userId, id);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Community post deleted successfully');
    }
    catch (err) {
        next(err);
    }
}
