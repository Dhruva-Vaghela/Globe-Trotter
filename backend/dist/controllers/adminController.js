"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleSchema = void 0;
exports.getDashboardAnalytics = getDashboardAnalytics;
exports.getPopularItems = getPopularItems;
exports.listUsers = listUsers;
exports.updateUserRole = updateUserRole;
exports.deleteUser = deleteUser;
const zod_1 = require("zod");
const adminService_js_1 = require("../services/adminService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const AppError_js_1 = require("../utils/AppError.js");
const client_1 = require("@prisma/client");
exports.updateUserRoleSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.nativeEnum(client_1.Role),
    }),
});
async function getDashboardAnalytics(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const analytics = await adminService_js_1.AdminService.getDashboardAnalytics();
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Admin analytics retrieved successfully', analytics);
    }
    catch (err) {
        next(err);
    }
}
async function getPopularItems(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const limit = req.query.limit ? Number(req.query.limit) : 5;
        const items = await adminService_js_1.AdminService.getPopularItems(limit);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Popular destinations and activities retrieved', items);
    }
    catch (err) {
        next(err);
    }
}
async function listUsers(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const query = {
            search: req.query.search,
            role: req.query.role,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 20,
        };
        const userList = await adminService_js_1.AdminService.listUsers(query);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Users list retrieved successfully', userList);
    }
    catch (err) {
        next(err);
    }
}
async function updateUserRole(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { userId } = req.params;
        const { role } = req.body;
        const updated = await adminService_js_1.AdminService.updateUserRole(req.user.userId, userId, role);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'User role updated successfully', updated);
    }
    catch (err) {
        next(err);
    }
}
async function deleteUser(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { userId } = req.params;
        const result = await adminService_js_1.AdminService.deleteUser(req.user.userId, userId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, result.message);
    }
    catch (err) {
        next(err);
    }
}
