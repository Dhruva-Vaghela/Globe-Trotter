import { prisma } from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { ExpenseCategory } from '@prisma/client';

export interface AddExpenseInput {
  category: ExpenseCategory;
  amount: number;
  description: string;
  date?: string | Date;
}

export interface UpdateExpenseInput {
  category?: ExpenseCategory;
  amount?: number;
  description?: string;
  date?: string | Date;
}

export class BudgetService {
  private static async getTripAndVerifyOwner(userId: string, tripId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        budget: true,
        expenses: { orderBy: { date: 'desc' } },
        sections: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }
    if (trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }
    return trip;
  }

  static async setTripBudget(userId: string, tripId: string, totalBudget: number) {
    await this.getTripAndVerifyOwner(userId, tripId);

    if (totalBudget < 0) {
      throw new AppError('Total budget cannot be negative', 400);
    }

    return await prisma.budget.upsert({
      where: { tripId },
      create: {
        tripId,
        totalBudget,
      },
      update: {
        totalBudget,
      },
    });
  }

  static async getBudgetOverview(userId: string, tripId: string) {
    const trip = await this.getTripAndVerifyOwner(userId, tripId);

    const totalBudget = trip.budget?.totalBudget ?? trip.sections.reduce((sum, s) => sum + (s.sectionBudget || 0), 0);

    const totalExpensesLogged = trip.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    let totalItineraryItemsCost = 0;
    const sectionCosts = trip.sections.map((sec) => {
      const secItemCost = sec.items.reduce((sum, i) => sum + (i.cost || 0), 0);
      totalItineraryItemsCost += secItemCost;
      return {
        sectionId: sec.id,
        title: sec.title,
        sectionBudget: sec.sectionBudget || 0,
        totalCost: secItemCost,
      };
    });

    const totalSpent = totalExpensesLogged + totalItineraryItemsCost;
    const remainingBudget = totalBudget - totalSpent;

    // Trip duration calculation
    const startMs = new Date(trip.startDate).getTime();
    const endMs = new Date(trip.endDate).getTime();
    const totalDurationDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);

    const dailyAverageCost = Math.round((totalSpent / totalDurationDays) * 100) / 100;

    // Category breakdown
    const categoryTotals: Record<ExpenseCategory, number> = {
      TRANSPORT: 0,
      ACCOMMODATION: 0,
      ACTIVITIES: totalItineraryItemsCost, // Include itinerary activity costs under ACTIVITIES
      MEALS: 0,
      MISCELLANEOUS: 0,
    };

    trip.expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + (e.amount || 0);
    });

    // Status and warning
    let status: 'UNDER_BUDGET' | 'ON_TRACK' | 'OVER_BUDGET' = 'UNDER_BUDGET';
    let warningMessage: string | null = null;

    if (totalBudget > 0) {
      const spentRatio = totalSpent / totalBudget;
      if (spentRatio > 1) {
        status = 'OVER_BUDGET';
        warningMessage = `Warning: You have exceeded your allocated budget by ₹${Math.abs(remainingBudget).toLocaleString('en-IN')}`;
      } else if (spentRatio >= 0.85) {
        status = 'ON_TRACK';
        warningMessage = `Notice: You have used ${Math.round(spentRatio * 100)}% of your trip budget.`;
      }
    }

    return {
      tripId: trip.id,
      tripName: trip.name,
      totalBudget,
      totalSpent,
      totalExpensesLogged,
      totalItineraryItemsCost,
      remainingBudget,
      totalDurationDays,
      dailyAverageCost,
      status,
      warningMessage,
      categoryBreakdown: categoryTotals,
      sectionCosts,
      expenses: trip.expenses,
    };
  }

  static async listExpenses(userId: string, tripId: string, category?: ExpenseCategory) {
    await this.getTripAndVerifyOwner(userId, tripId);

    return await prisma.expense.findMany({
      where: {
        tripId,
        ...(category && { category }),
      },
      orderBy: { date: 'desc' },
    });
  }

  static async addExpense(userId: string, tripId: string, input: AddExpenseInput) {
    await this.getTripAndVerifyOwner(userId, tripId);

    if (input.amount < 0) {
      throw new AppError('Expense amount cannot be negative', 400);
    }
    if (!input.description.trim()) {
      throw new AppError('Description is required', 400);
    }

    return await prisma.expense.create({
      data: {
        tripId,
        category: input.category || ExpenseCategory.MISCELLANEOUS,
        amount: input.amount,
        description: input.description,
        date: input.date ? new Date(input.date) : new Date(),
      },
    });
  }

  static async updateExpense(userId: string, tripId: string, expenseId: string, input: UpdateExpenseInput) {
    await this.getTripAndVerifyOwner(userId, tripId);

    const existingExpense = await prisma.expense.findFirst({
      where: { id: expenseId, tripId },
    });
    if (!existingExpense) {
      throw new AppError('Expense record not found', 404);
    }

    if (input.amount !== undefined && input.amount < 0) {
      throw new AppError('Expense amount cannot be negative', 400);
    }

    return await prisma.expense.update({
      where: { id: expenseId },
      data: {
        ...(input.category && { category: input.category }),
        ...(input.amount !== undefined && { amount: input.amount }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.date && { date: new Date(input.date) }),
      },
    });
  }

  static async deleteExpense(userId: string, tripId: string, expenseId: string) {
    await this.getTripAndVerifyOwner(userId, tripId);

    const existingExpense = await prisma.expense.findFirst({
      where: { id: expenseId, tripId },
    });
    if (!existingExpense) {
      throw new AppError('Expense record not found', 404);
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    return { success: true, message: 'Expense record deleted successfully' };
  }
}
