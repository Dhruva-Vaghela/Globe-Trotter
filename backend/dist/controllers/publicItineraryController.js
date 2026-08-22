"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShareLink = generateShareLink;
exports.revokeShareLink = revokeShareLink;
exports.getPublicItineraryByToken = getPublicItineraryByToken;
exports.getPublicItineraryById = getPublicItineraryById;
exports.copyPublicTrip = copyPublicTrip;
const publicItineraryService_js_1 = require("../services/publicItineraryService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const AppError_js_1 = require("../utils/AppError.js");
async function generateShareLink(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const shareData = await publicItineraryService_js_1.PublicItineraryService.generateShareLink(req.user.userId, tripId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Public share link generated successfully', shareData);
    }
    catch (err) {
        next(err);
    }
}
async function revokeShareLink(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const result = await publicItineraryService_js_1.PublicItineraryService.revokeShareLink(req.user.userId, tripId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, result.message);
    }
    catch (err) {
        next(err);
    }
}
async function getPublicItineraryByToken(req, res, next) {
    try {
        const { token } = req.params;
        const itineraryData = await publicItineraryService_js_1.PublicItineraryService.getPublicItineraryByToken(token);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Public itinerary retrieved successfully', itineraryData);
    }
    catch (err) {
        next(err);
    }
}
async function getPublicItineraryById(req, res, next) {
    try {
        const { tripId } = req.params;
        const itineraryData = await publicItineraryService_js_1.PublicItineraryService.getPublicItineraryById(tripId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Public itinerary retrieved successfully', itineraryData);
    }
    catch (err) {
        next(err);
    }
}
async function copyPublicTrip(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { identifier } = req.params;
        const result = await publicItineraryService_js_1.PublicItineraryService.copyPublicTrip(req.user.userId, identifier);
        return (0, ApiResponse_js_1.sendResponse)(res, 201, result.message, result);
    }
    catch (err) {
        next(err);
    }
}
