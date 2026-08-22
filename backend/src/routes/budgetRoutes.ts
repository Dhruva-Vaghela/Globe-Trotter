import { Router } from 'express';
import {
  getBudgetOverview,
  setTripBudget,
  listExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  setBudgetSchema,
  addExpenseSchema,
  updateExpenseSchema,
} from '../controllers/budgetController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

// Budget routes
router.get('/:tripId/budget', getBudgetOverview);
router.put('/:tripId/budget', validate(setBudgetSchema), setTripBudget);

// Expense routes
router.get('/:tripId/expenses', listExpenses);
router.post('/:tripId/expenses', validate(addExpenseSchema), addExpense);
router.put('/:tripId/expenses/:expenseId', validate(updateExpenseSchema), updateExpense);
router.delete('/:tripId/expenses/:expenseId', deleteExpense);

export default router;
