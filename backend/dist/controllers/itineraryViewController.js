"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayWiseView = getDayWiseView;
exports.getTimelineView = getTimelineView;
exports.getSummaryView = getSummaryView;
const itineraryViewService_js_1 = require("../services/itineraryViewService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const AppError_js_1 = require("../utils/AppError.js");
async function getDayWiseView(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const daywiseData = await itineraryViewService_js_1.ItineraryViewService.getDayWiseView(req.user.userId, tripId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Day-wise itinerary retrieved successfully', daywiseData);
    }
    catch (err) {
        next(err);
    }
}
async function getTimelineView(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const timelineData = await itineraryViewService_js_1.ItineraryViewService.getTimelineView(req.user.userId, tripId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Itinerary timeline retrieved successfully', timelineData);
    }
    catch (err) {
        next(err);
    }
}
async function getSummaryView(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const summaryData = await itineraryViewService_js_1.ItineraryViewService.getSummaryView(req.user.userId, tripId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Itinerary summary retrieved successfully', summaryData);
    }
    catch (err) {
        next(err);
    }
}
