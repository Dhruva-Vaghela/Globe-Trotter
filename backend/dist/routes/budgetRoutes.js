"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const budgetController_js_1 = require("../controllers/budgetController.js");
const validateMiddleware_js_1 = require("../middlewares/validateMiddleware.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(authMiddleware_js_1.authMiddleware);
// Budget routes
router.get('/:tripId/budget', budgetController_js_1.getBudgetOverview);
router.put('/:tripId/budget', (0, validateMiddleware_js_1.validate)(budgetController_js_1.setBudgetSchema), budgetController_js_1.setTripBudget);
// Expense routes
router.get('/:tripId/expenses', budgetController_js_1.listExpenses);
router.post('/:tripId/expenses', (0, validateMiddleware_js_1.validate)(budgetController_js_1.addExpenseSchema), budgetController_js_1.addExpense);
router.put('/:tripId/expenses/:expenseId', (0, validateMiddleware_js_1.validate)(budgetController_js_1.updateExpenseSchema), budgetController_js_1.updateExpense);
router.delete('/:tripId/expenses/:expenseId', budgetController_js_1.deleteExpense);
exports.default = router;
