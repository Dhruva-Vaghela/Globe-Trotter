process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_JU7aEI5nlOyS@ep-jolly-fog-az4250at-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

import { prisma } from './config/db.js';
import { ItineraryBuilderService } from './services/itineraryBuilderService.js';
import { ItineraryViewService } from './services/itineraryViewService.js';

async function runModules6And7Tests() {
  console.log('========================================================================');
  console.log('  STARTING MODULE 6 & 7 (ITINERARY BUILDER & VIEW HUB) VERIFICATION  ');
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
    // Setup Demo User & Demo Trip
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

    const startDate = new Date('2026-09-01T00:00:00.000Z');
    const endDate = new Date('2026-09-10T00:00:00.000Z');

    const testTrip = await prisma.trip.create({
      data: {
        userId: demoUser.id,
        name: 'Grand European Tour Test',
        startDate,
        endDate,
        stops: {
          create: [
            {
              destinationName: 'Eiffel Tower Area',
              city: 'Paris',
              country: 'France',
              arrivalDate: startDate,
              departureDate: new Date('2026-09-05T00:00:00.000Z'),
              orderIndex: 0,
            },
            {
              destinationName: 'Colosseum District',
              city: 'Rome',
              country: 'Italy',
              arrivalDate: new Date('2026-09-05T00:00:00.000Z'),
              departureDate: endDate,
              orderIndex: 1,
            },
          ],
        },
        budget: {
          create: {
            totalBudget: 150000,
          },
        },
      },
    });

    assert(!!testTrip.id, 'Created test trip with dates Sep 1 to Sep 10');

    // 1. Test Section Creation & Date Validation
    let dateValidationErrorThrown = false;
    try {
      await ItineraryBuilderService.createSection(demoUser.id, testTrip.id, {
        title: 'Invalid Date Section',
        startDate: new Date('2026-08-25T00:00:00.000Z'), // Before trip startDate
        endDate: new Date('2026-09-02T00:00:00.000Z'),
      });
    } catch (err: any) {
      dateValidationErrorThrown = err.statusCode === 400;
    }
    assert(dateValidationErrorThrown, 'createSection rejects dates before trip startDate');

    const sec1 = await ItineraryBuilderService.createSection(demoUser.id, testTrip.id, {
      title: 'Day 1-3: Exploring Paris',
      startDate: new Date('2026-09-01T00:00:00.000Z'),
      endDate: new Date('2026-09-03T00:00:00.000Z'),
      sectionBudget: 40000,
    });
    assert(sec1.id !== undefined && sec1.title === 'Day 1-3: Exploring Paris', 'createSection creates section within valid trip date boundaries');

    const sec2 = await ItineraryBuilderService.createSection(demoUser.id, testTrip.id, {
      title: 'Day 4-5: Paris Museums',
      startDate: new Date('2026-09-04T00:00:00.000Z'),
      endDate: new Date('2026-09-05T00:00:00.000Z'),
      sectionBudget: 30000,
    });
    assert(sec2.id !== undefined && sec2.orderIndex === 1, 'createSection auto-increments section orderIndex');

    // 2. Test Update Section
    const updatedSec1 = await ItineraryBuilderService.updateSection(demoUser.id, testTrip.id, sec1.id, {
      title: 'Day 1-3: Exploring Paris & Versailles',
      sectionBudget: 45000,
    });
    assert(updatedSec1.title === 'Day 1-3: Exploring Paris & Versailles' && updatedSec1.sectionBudget === 45000, 'updateSection updates section title and budget allocation');

    // 3. Test Adding Items to Section
    const item1 = await ItineraryBuilderService.addItemToSection(demoUser.id, testTrip.id, sec1.id, {
      title: 'Eiffel Tower Summit Tour',
      notes: 'Pre-booked skip the line ticket',
      startTime: '09:30 AM',
      cost: 3500,
    });
    assert(item1.id !== undefined && item1.cost === 3500, 'addItemToSection adds item with start time and cost badge');

    const item2 = await ItineraryBuilderService.addItemToSection(demoUser.id, testTrip.id, sec1.id, {
      title: 'Seine River Sunset Cruise & Dinner',
      notes: 'Romantic evening boat ride',
      startTime: '07:00 PM',
      cost: 6500,
    });
    assert(item2.id !== undefined && item2.orderIndex === 1, 'addItemToSection sets orderIndex sequentially');

    // 4. Test Reordering Items
    const reordered = await ItineraryBuilderService.reorderItems(demoUser.id, testTrip.id, sec1.id, [item2.id, item1.id]);
    assert(reordered[0].id === item2.id && reordered[0].orderIndex === 0, 'reorderItems updates item orderIndex order');

    // 5. Test Day-Wise View Endpoint Logic
    const daywise = await ItineraryViewService.getDayWiseView(demoUser.id, testTrip.id);
    assert(daywise.sections.length === 2 && daywise.summary.totalTripCost === 10000, 'getDayWiseView aggregates section items and total trip cost');

    // 6. Test Timeline View Endpoint Logic
    const timeline = await ItineraryViewService.getTimelineView(demoUser.id, testTrip.id);
    assert(
      timeline.events.length >= 4 && timeline.events.some((e) => e.type === 'ARRIVAL') && timeline.events.some((e) => e.type === 'MEAL'),
      'getTimelineView returns chronological events including destination arrivals and meals'
    );

    // 7. Test Summary View Endpoint Logic
    const summary = await ItineraryViewService.getSummaryView(demoUser.id, testTrip.id);
    assert(
      summary.totalDurationDays === 10 && summary.totalActivitiesCount === 2 && summary.destinationSequence.length === 2,
      'getSummaryView calculates total duration, activity count, and destination sequence'
    );

    // 8. Test Item Removal & Section Deletion
    await ItineraryBuilderService.removeItem(demoUser.id, testTrip.id, item1.id);
    const item1Deleted = await prisma.itineraryItem.findUnique({ where: { id: item1.id } });
    assert(item1Deleted === null, 'removeItem deletes single item from database');

    await ItineraryBuilderService.deleteSection(demoUser.id, testTrip.id, sec2.id);
    const sec2Deleted = await prisma.itinerarySection.findUnique({ where: { id: sec2.id } });
    assert(sec2Deleted === null, 'deleteSection cascades deletion of day section');

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

runModules6And7Tests();
