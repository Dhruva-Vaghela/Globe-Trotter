process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_JU7aEI5nlOyS@ep-jolly-fog-az4250at-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

import { prisma } from './config/db.js';
import { BudgetService } from './services/budgetService.js';
import { ExpenseCategory } from '@prisma/client';

async function runModule8Tests() {
  console.log('========================================================================');
  console.log('  STARTING MODULE 8 (BUDGET & COST MANAGEMENT) VERIFICATION TESTS  ');
  console.log('========================================================================\n');

  let passedCount = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] Test ${totalTests}: ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] Test ${totalTests}: ${testName}`);
    }
  }

  try {
    // 1. Setup Demo User & Test Trip
    let demoUser = await prisma.user.findFirst({ where: { email: 'demo@globetrotter.app' } });
    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          email: 'demo@globetrotter.app',
          passwordHash: 'dummyhash',
          name: 'Demo User',
        },
      });
    }

    const testTrip = await prisma.trip.create({
      data: {
        userId: demoUser.id,
        name: 'Goa Budget Test Trip',
        startDate: new Date('2026-10-01T00:00:00.000Z'),
        endDate: new Date('2026-10-05T00:00:00.000Z'), // 5 days
        sections: {
          create: [
            {
              title: 'Day 1: Beach Day',
              startDate: new Date('2026-10-01T00:00:00.000Z'),
              endDate: new Date('2026-10-01T00:00:00.000Z'),
              sectionBudget: 10000,
              items: {
                create: [
                  {
                    title: 'Water Sports Package',
                    cost: 3500,
                    date: new Date('2026-10-01T00:00:00.000Z'),
                  },
                ],
              },
            },
          ],
        },
      },
    });

    assert(!!testTrip.id, 'Created test trip for budget verification');

    // 2. Test Set Trip Budget
    const setBudget = await BudgetService.setTripBudget(demoUser.id, testTrip.id, 50000);
    assert(setBudget.totalBudget === 50000, 'setTripBudget successfully sets planned trip budget (₹50,000)');

    // 3. Test Add Expense across Categories
    const exp1 = await BudgetService.addExpense(demoUser.id, testTrip.id, {
      category: ExpenseCategory.ACCOMMODATION,
      amount: 18000,
      description: 'Resort 4-Night Stay',
    });
    assert(exp1.id !== undefined && exp1.category === 'ACCOMMODATION', 'addExpense creates ACCOMMODATION expense entry');

    const exp2 = await BudgetService.addExpense(demoUser.id, testTrip.id, {
      category: ExpenseCategory.TRANSPORT,
      amount: 6000,
      description: 'Flight tickets & Airport Taxi',
    });
    assert(exp2.id !== undefined && exp2.amount === 6000, 'addExpense creates TRANSPORT expense entry');

    const exp3 = await BudgetService.addExpense(demoUser.id, testTrip.id, {
      category: ExpenseCategory.MEALS,
      amount: 4500,
      description: 'Seafood Buffet Dinner',
    });
    assert(exp3.id !== undefined && exp3.category === 'MEALS', 'addExpense creates MEALS expense entry');

    // 4. Test List Expenses with Filtering
    const transportExpenses = await BudgetService.listExpenses(demoUser.id, testTrip.id, ExpenseCategory.TRANSPORT);
    assert(
      transportExpenses.length === 1 && transportExpenses[0].id === exp2.id,
      'listExpenses with category filter correctly filters TRANSPORT expenses'
    );

    // 5. Test Update Expense
    const updatedExp3 = await BudgetService.updateExpense(demoUser.id, testTrip.id, exp3.id, {
      amount: 5500,
      description: 'Seafood & Drinks Buffet Dinner',
    });
    assert(
      updatedExp3.amount === 5500 && updatedExp3.description.includes('Drinks'),
      'updateExpense updates expense amount and description'
    );

    // 6. Test Budget Overview Calculation
    // Total logged expenses: 18000 + 6000 + 5500 = 29500
    // Total itinerary items cost: 3500
    // Total spent: 33000
    // Remaining budget: 50000 - 33000 = 17000
    // Duration: 5 days -> Daily average cost: 33000 / 5 = 6600
    const overview1 = await BudgetService.getBudgetOverview(demoUser.id, testTrip.id);
    assert(
      overview1.totalSpent === 33000 &&
        overview1.remainingBudget === 17000 &&
        overview1.dailyAverageCost === 6600 &&
        overview1.status === 'UNDER_BUDGET',
      'getBudgetOverview accurately calculates total spent (₹33,000), remaining budget (₹17,000), and daily average (₹6,600/day)'
    );

    // 7. Test Over-Budget Warning Trigger
    await BudgetService.addExpense(demoUser.id, testTrip.id, {
      category: ExpenseCategory.MISCELLANEOUS,
      amount: 25000,
      description: 'Luxury Shopping Excursion',
    });

    const overview2 = await BudgetService.getBudgetOverview(demoUser.id, testTrip.id);
    assert(
      overview2.totalSpent === 58000 &&
        overview2.status === 'OVER_BUDGET' &&
        !!overview2.warningMessage &&
        overview2.warningMessage.includes('exceeded'),
      'getBudgetOverview triggers OVER_BUDGET status and warning message when spending exceeds budget'
    );

    // 8. Test Delete Expense
    await BudgetService.deleteExpense(demoUser.id, testTrip.id, exp1.id);
    const deletedCheck = await prisma.expense.findUnique({ where: { id: exp1.id } });
    assert(deletedCheck === null, 'deleteExpense removes expense record from database');

    // Cleanup test trip
    await prisma.trip.delete({ where: { id: testTrip.id } });

    console.log('\n========================================================================');
    console.log(`  VERIFICATION RESULTS: ${passedCount} / ${totalTests} TESTS PASSED`);
    console.log('========================================================================\n');

    if (passedCount === totalTests) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution failed with exception:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runModule8Tests();
