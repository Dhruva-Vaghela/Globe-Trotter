"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTripSchema = exports.createTripSchema = void 0;
exports.createTrip = createTrip;
exports.getTrip = getTrip;
exports.listTrips = listTrips;
exports.updateTrip = updateTrip;
exports.deleteTrip = deleteTrip;
const zod_1 = require("zod");
const tripService_js_1 = require("../services/tripService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const AppError_js_1 = require("../utils/AppError.js");
const client_1 = require("@prisma/client");
exports.createTripSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Trip name must be at least 2 characters'),
        description: zod_1.z.string().optional(),
        startDate: zod_1.z.string().or(zod_1.z.date()),
        endDate: zod_1.z.string().or(zod_1.z.date()),
        coverImageUrl: zod_1.z.string().url().or(zod_1.z.string().length(0)).optional(),
        destinationCity: zod_1.z.string().optional(),
        destinationCountry: zod_1.z.string().optional(),
        totalBudget: zod_1.z.number().min(0).optional(),
        isPublic: zod_1.z.boolean().optional(),
    }),
});
exports.updateTripSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        description: zod_1.z.string().optional(),
        startDate: zod_1.z.string().or(zod_1.z.date()).optional(),
        endDate: zod_1.z.string().or(zod_1.z.date()).optional(),
        coverImageUrl: zod_1.z.string().url().or(zod_1.z.string().length(0)).optional(),
        status: zod_1.z.nativeEnum(client_1.TripStatus).optional(),
        isPublic: zod_1.z.boolean().optional(),
        totalBudget: zod_1.z.number().min(0).optional(),
    }),
});
async function createTrip(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const trip = await tripService_js_1.TripService.createTrip(req.user.userId, req.body);
        return (0, ApiResponse_js_1.sendResponse)(res, 201, 'Trip created successfully', trip);
    }
    catch (err) {
        next(err);
    }
}
async function getTrip(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const trip = await tripService_js_1.TripService.getTripById(req.user.userId, req.params.id);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Trip details retrieved', trip);
    }
    catch (err) {
        next(err);
    }
}
async function listTrips(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const query = {
            search: req.query.search,
            status: req.query.status,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        };
        const trips = await tripService_js_1.TripService.listUserTrips(req.user.userId, query);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'User trips retrieved', trips);
    }
    catch (err) {
        next(err);
    }
}
async function updateTrip(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const updated = await tripService_js_1.TripService.updateTrip(req.user.userId, req.params.id, req.body);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Trip updated successfully', updated);
    }
    catch (err) {
        next(err);
    }
}
async function deleteTrip(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        await tripService_js_1.TripService.deleteTrip(req.user.userId, req.params.id);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Trip deleted successfully');
    }
    catch (err) {
        next(err);
    }
}
