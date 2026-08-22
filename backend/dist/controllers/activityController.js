"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderItemsSchema = exports.addActivityToSectionSchema = exports.listActivitiesSchema = void 0;
exports.listActivities = listActivities;
exports.getActivityById = getActivityById;
exports.addActivityToSection = addActivityToSection;
exports.removeItineraryItem = removeItineraryItem;
exports.reorderItineraryItems = reorderItineraryItems;
const zod_1 = require("zod");
const activityService_js_1 = require("../services/activityService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const AppError_js_1 = require("../utils/AppError.js");
exports.listActivitiesSchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        maxCost: zod_1.z.string().optional().transform((val) => (val ? Number(val) : undefined)),
        maxDuration: zod_1.z.string().optional().transform((val) => (val ? Number(val) : undefined)),
        minRating: zod_1.z.string().optional().transform((val) => (val ? Number(val) : undefined)),
        sortBy: zod_1.z.enum(['rating', 'cost_asc', 'cost_desc', 'duration']).optional(),
        sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    }),
});
exports.addActivityToSectionSchema = zod_1.z.object({
    body: zod_1.z.object({
        activityId: zod_1.z.string().uuid().optional(),
        title: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
        date: zod_1.z.string().or(zod_1.z.date()).optional(),
        startTime: zod_1.z.string().optional(),
        cost: zod_1.z.number().min(0).optional(),
    }),
});
exports.reorderItemsSchema = zod_1.z.object({
    body: zod_1.z.object({
        itemIds: zod_1.z.array(zod_1.z.string().uuid('Each item ID must be a valid UUID')),
    }),
});
async function listActivities(req, res, next) {
    try {
        const query = {
            search: req.query.search,
            category: req.query.category,
            location: req.query.location,
            maxCost: req.query.maxCost ? Number(req.query.maxCost) : undefined,
            maxDuration: req.query.maxDuration ? Number(req.query.maxDuration) : undefined,
            minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        };
        const activities = await activityService_js_1.ActivityService.listActivities(query);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Activities retrieved successfully', activities);
    }
    catch (err) {
        next(err);
    }
}
async function getActivityById(req, res, next) {
    try {
        const { id } = req.params;
        const activity = await activityService_js_1.ActivityService.getActivityById(id);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Activity details retrieved successfully', activity);
    }
    catch (err) {
        next(err);
    }
}
async function addActivityToSection(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId, sectionId } = req.params;
        const item = await activityService_js_1.ActivityService.addActivityToSection(req.user.userId, tripId, sectionId, req.body);
        return (0, ApiResponse_js_1.sendResponse)(res, 201, 'Activity attached to trip section successfully', item);
    }
    catch (err) {
        next(err);
    }
}
async function removeItineraryItem(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId, itemId } = req.params;
        await activityService_js_1.ActivityService.removeItineraryItem(req.user.userId, tripId, itemId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Itinerary item removed successfully');
    }
    catch (err) {
        next(err);
    }
}
async function reorderItineraryItems(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId, sectionId } = req.params;
        const { itemIds } = req.body;
        const reordered = await activityService_js_1.ActivityService.reorderItineraryItems(req.user.userId, tripId, sectionId, itemIds);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Itinerary items reordered successfully', reordered);
    }
    catch (err) {
        next(err);
    }
}
