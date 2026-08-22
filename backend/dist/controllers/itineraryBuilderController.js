"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderItemsSchema = exports.addItemToSectionSchema = exports.updateSectionSchema = exports.createSectionSchema = void 0;
exports.createSection = createSection;
exports.updateSection = updateSection;
exports.deleteSection = deleteSection;
exports.addItem = addItem;
exports.removeItem = removeItem;
exports.reorderItems = reorderItems;
const zod_1 = require("zod");
const itineraryBuilderService_js_1 = require("../services/itineraryBuilderService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const AppError_js_1 = require("../utils/AppError.js");
exports.createSectionSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        startDate: zod_1.z.string().or(zod_1.z.date()),
        endDate: zod_1.z.string().or(zod_1.z.date()),
        sectionBudget: zod_1.z.number().min(0).optional(),
    }),
});
exports.updateSectionSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        startDate: zod_1.z.string().or(zod_1.z.date()).optional(),
        endDate: zod_1.z.string().or(zod_1.z.date()).optional(),
        sectionBudget: zod_1.z.number().min(0).optional(),
    }),
});
exports.addItemToSectionSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        activityId: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
        date: zod_1.z.string().or(zod_1.z.date()).optional(),
        startTime: zod_1.z.string().optional(),
        cost: zod_1.z.number().min(0).optional(),
    }),
});
exports.reorderItemsSchema = zod_1.z.object({
    body: zod_1.z.object({
        itemIds: zod_1.z.array(zod_1.z.string()).min(1, 'itemIds must contain at least one item'),
    }),
});
async function createSection(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const section = await itineraryBuilderService_js_1.ItineraryBuilderService.createSection(req.user.userId, tripId, req.body);
        return (0, ApiResponse_js_1.sendResponse)(res, 201, 'Itinerary section created successfully', section);
    }
    catch (err) {
        next(err);
    }
}
async function updateSection(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId, sectionId } = req.params;
        const updated = await itineraryBuilderService_js_1.ItineraryBuilderService.updateSection(req.user.userId, tripId, sectionId, req.body);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Itinerary section updated successfully', updated);
    }
    catch (err) {
        next(err);
    }
}
async function deleteSection(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId, sectionId } = req.params;
        const result = await itineraryBuilderService_js_1.ItineraryBuilderService.deleteSection(req.user.userId, tripId, sectionId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, result.message);
    }
    catch (err) {
        next(err);
    }
}
async function addItem(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId, sectionId } = req.params;
        const item = await itineraryBuilderService_js_1.ItineraryBuilderService.addItemToSection(req.user.userId, tripId, sectionId, req.body);
        return (0, ApiResponse_js_1.sendResponse)(res, 201, 'Itinerary item added successfully', item);
    }
    catch (err) {
        next(err);
    }
}
async function removeItem(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId, itemId } = req.params;
        const result = await itineraryBuilderService_js_1.ItineraryBuilderService.removeItem(req.user.userId, tripId, itemId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, result.message);
    }
    catch (err) {
        next(err);
    }
}
async function reorderItems(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId, sectionId } = req.params;
        const items = await itineraryBuilderService_js_1.ItineraryBuilderService.reorderItems(req.user.userId, tripId, sectionId, req.body.itemIds);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Items reordered successfully', items);
    }
    catch (err) {
        next(err);
    }
}
