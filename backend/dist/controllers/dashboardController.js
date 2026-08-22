"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = getDashboardSummary;
exports.getDashboardTrips = getDashboardTrips;
exports.getPopularDestinations = getPopularDestinations;
exports.getRecommendedContent = getRecommendedContent;
const dashboardService_js_1 = require("../services/dashboardService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const AppError_js_1 = require("../utils/AppError.js");
async function getDashboardSummary(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const summary = await dashboardService_js_1.DashboardService.getDashboardSummary(req.user.userId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Dashboard summary retrieved', summary);
    }
    catch (err) {
        next(err);
    }
}
async function getDashboardTrips(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const trips = await dashboardService_js_1.DashboardService.getUserTrips(req.user.userId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'User trips retrieved', trips);
    }
    catch (err) {
        next(err);
    }
}
async function getPopularDestinations(req, res, next) {
    try {
        const destinations = await dashboardService_js_1.DashboardService.getPopularDestinations();
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Popular destinations retrieved', destinations);
    }
    catch (err) {
        next(err);
    }
}
async function getRecommendedContent(req, res, next) {
    try {
        const userId = req.user?.userId;
        const recommendations = await dashboardService_js_1.DashboardService.getRecommendedContent(userId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Recommended content retrieved', recommendations);
    }
    catch (err) {
        next(err);
    }
}
