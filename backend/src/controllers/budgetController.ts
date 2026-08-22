import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { BudgetService } from '../services/budgetService.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AppError } from '../utils/AppError.js';
import { ExpenseCategory } from '@prisma/client';

export const setBudgetSchema = z.object({
  body: z.object({
    totalBudget: z.number().min(0, 'Total budget must be a non-negative number'),
  }),
});

export const addExpenseSchema = z.object({
  body: z.object({
    category: z.nativeEnum(ExpenseCategory),
    amount: z.number().min(0, 'Amount must be non-negative'),
    description: z.string().min(1, 'Description is required'),
    date: z.string().or(z.date()).optional(),
  }),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    category: z.nativeEnum(ExpenseCategory).optional(),
    amount: z.number().min(0).optional(),
    description: z.string().min(1).optional(),
    date: z.string().or(z.date()).optional(),
  }),
});

export async function getBudgetOverview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const overview = await BudgetService.getBudgetOverview(req.user.userId, tripId);
    return sendResponse(res, 200, 'Budget overview retrieved successfully', overview);
  } catch (err) {
    next(err);
  }
}

export async function setTripBudget(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const budget = await BudgetService.setTripBudget(req.user.userId, tripId, req.body.totalBudget);
    return sendResponse(res, 200, 'Trip budget updated successfully', budget);
  } catch (err) {
    next(err);
  }
}

export async function listExpenses(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const category = req.query.category as ExpenseCategory | undefined;
    const expenses = await BudgetService.listExpenses(req.user.userId, tripId, category);
    return sendResponse(res, 200, 'Expenses retrieved successfully', expenses);
  } catch (err) {
    next(err);
  }
}

export async function addExpense(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const expense = await BudgetService.addExpense(req.user.userId, tripId, req.body);
    return sendResponse(res, 201, 'Expense record created successfully', expense);
  } catch (err) {
    next(err);
  }
}

export async function updateExpense(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId, expenseId } = req.params;
    const updated = await BudgetService.updateExpense(req.user.userId, tripId, expenseId, req.body);
    return sendResponse(res, 200, 'Expense record updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteExpense(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId, expenseId } = req.params;
    const result = await BudgetService.deleteExpense(req.user.userId, tripId, expenseId);
    return sendResponse(res, 200, result.message);
  } catch (err) {
    next(err);
  }
}
