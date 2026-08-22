"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExpenseSchema = exports.addExpenseSchema = exports.setBudgetSchema = void 0;
exports.getBudgetOverview = getBudgetOverview;
exports.setTripBudget = setTripBudget;
exports.listExpenses = listExpenses;
exports.addExpense = addExpense;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;
const zod_1 = require("zod");
const budgetService_js_1 = require("../services/budgetService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const AppError_js_1 = require("../utils/AppError.js");
const client_1 = require("@prisma/client");
exports.setBudgetSchema = zod_1.z.object({
    body: zod_1.z.object({
        totalBudget: zod_1.z.number().min(0, 'Total budget must be a non-negative number'),
    }),
});
exports.addExpenseSchema = zod_1.z.object({
    body: zod_1.z.object({
        category: zod_1.z.nativeEnum(client_1.ExpenseCategory),
        amount: zod_1.z.number().min(0, 'Amount must be non-negative'),
        description: zod_1.z.string().min(1, 'Description is required'),
        date: zod_1.z.string().or(zod_1.z.date()).optional(),
    }),
});
exports.updateExpenseSchema = zod_1.z.object({
    body: zod_1.z.object({
        category: zod_1.z.nativeEnum(client_1.ExpenseCategory).optional(),
        amount: zod_1.z.number().min(0).optional(),
        description: zod_1.z.string().min(1).optional(),
        date: zod_1.z.string().or(zod_1.z.date()).optional(),
    }),
});
async function getBudgetOverview(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const overview = await budgetService_js_1.BudgetService.getBudgetOverview(req.user.userId, tripId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Budget overview retrieved successfully', overview);
    }
    catch (err) {
        next(err);
    }
}
async function setTripBudget(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const budget = await budgetService_js_1.BudgetService.setTripBudget(req.user.userId, tripId, req.body.totalBudget);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Trip budget updated successfully', budget);
    }
    catch (err) {
        next(err);
    }
}
async function listExpenses(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const category = req.query.category;
        const expenses = await budgetService_js_1.BudgetService.listExpenses(req.user.userId, tripId, category);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Expenses retrieved successfully', expenses);
    }
    catch (err) {
        next(err);
    }
}
async function addExpense(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId } = req.params;
        const expense = await budgetService_js_1.BudgetService.addExpense(req.user.userId, tripId, req.body);
        return (0, ApiResponse_js_1.sendResponse)(res, 201, 'Expense record created successfully', expense);
    }
    catch (err) {
        next(err);
    }
}
async function updateExpense(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId, expenseId } = req.params;
        const updated = await budgetService_js_1.BudgetService.updateExpense(req.user.userId, tripId, expenseId, req.body);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Expense record updated successfully', updated);
    }
    catch (err) {
        next(err);
    }
}
async function deleteExpense(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { tripId, expenseId } = req.params;
        const result = await budgetService_js_1.BudgetService.deleteExpense(req.user.userId, tripId, expenseId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, result.message);
    }
    catch (err) {
        next(err);
    }
}
