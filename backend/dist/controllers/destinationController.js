"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDestinations = getDestinations;
exports.getDestination = getDestination;
exports.addStopToTrip = addStopToTrip;
exports.removeStopFromTrip = removeStopFromTrip;
exports.reorderStops = reorderStops;
const destinationService_js_1 = require("../services/destinationService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const AppError_js_1 = require("../utils/AppError.js");
async function getDestinations(req, res, next) {
    try {
        const destinations = await destinationService_js_1.DestinationService.listDestinations(req.query);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Destinations retrieved successfully', destinations);
    }
    catch (err) {
        next(err);
    }
}
async function getDestination(req, res, next) {
    try {
        const { id } = req.params;
        const destination = await destinationService_js_1.DestinationService.getDestinationById(id);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Destination details retrieved successfully', destination);
    }
    catch (err) {
        next(err);
    }
}
async function addStopToTrip(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const stop = await destinationService_js_1.DestinationService.addTripStop(req.user.userId, tripId, req.body);
        return (0, ApiResponse_js_1.sendResponse)(res, 201, 'Stop added to trip successfully', stop);
    }
    catch (err) {
        next(err);
    }
}
async function removeStopFromTrip(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId, stopId } = req.params;
        await destinationService_js_1.DestinationService.removeTripStop(req.user.userId, tripId, stopId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Stop removed from trip successfully');
    }
    catch (err) {
        next(err);
    }
}
async function reorderStops(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const stopIds = req.body.stopIds || req.body.stops || [];
        if (!Array.isArray(stopIds)) {
            throw new AppError_js_1.AppError('stopIds must be an array of string IDs', 400);
        }
        const updatedStops = await destinationService_js_1.DestinationService.reorderTripStops(req.user.userId, tripId, stopIds);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Trip stops reordered successfully', updatedStops);
    }
    catch (err) {
        next(err);
    }
}
