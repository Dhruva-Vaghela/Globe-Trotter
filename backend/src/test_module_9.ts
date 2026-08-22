import { prisma } from './config/db.js';
import { CalendarService } from './services/calendarService.js';

async function runModule9Tests() {
  console.log('===========================================================');
  console.log('  STARTING MODULE 9 (CALENDAR & TIMELINE) VERIFICATION TESTS ');
  console.log('===========================================================\n');

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
    const demoUser = await prisma.user.findFirst({ where: { email: 'demo@globetrotter.app' } });
    if (!demoUser) throw new Error('Demo user not found');

    // 1. Test getCalendarOverview()
    const overview = await CalendarService.getCalendarOverview(demoUser.id);
    assert(
      typeof overview.tripsCount === 'number' &&
        typeof overview.totalEventsCount === 'number' &&
        Array.isArray(overview.events),
      'getCalendarOverview() returns transformed calendar events array and trip counts'
    );

    // 2. Test event transformations (TRIP, STOP, SECTION, ACTIVITY types)
    const hasTripEvents = overview.events.some((e) => e.type === 'TRIP');
    assert(hasTripEvents, 'getCalendarOverview() transforms trips into calendar span events');

    // 3. Test getTripCalendarData()
    let demoTrip = await prisma.trip.findFirst({
      where: { userId: demoUser.id },
      include: { sections: true },
    });

    if (!demoTrip) {
      demoTrip = await prisma.trip.create({
        data: {
          userId: demoUser.id,
          name: 'Timeline Test Trip',
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000 * 4),
          sections: {
            create: [
              { title: 'Day 1: Arrival', startDate: new Date(), endDate: new Date(), orderIndex: 0 },
              { title: 'Day 2: City Walk', startDate: new Date(), endDate: new Date(), orderIndex: 1 },
            ],
          },
        },
        include: { sections: true },
      });
    }

    const tripData = await CalendarService.getTripCalendarData(demoUser.id, demoTrip.id);
    assert(
      tripData && Array.isArray(tripData.events),
      'getTripCalendarData() returns calendar data for specific trip'
    );

    console.log('\n===========================================================');
    console.log(`  RESULTS: ${passedCount} / ${totalTests} TESTS PASSED`);
    console.log('===========================================================\n');

    if (passedCount === totalTests) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runModule9Tests();
