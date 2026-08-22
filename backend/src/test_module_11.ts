process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_JU7aEI5nlOyS@ep-jolly-fog-az4250at-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

import { prisma } from './config/db.js';
import { PublicItineraryService } from './services/publicItineraryService.js';

async function runModule11Tests() {
  console.log('========================================================================');
  console.log('  STARTING MODULE 11 (PUBLIC / SHARED ITINERARY) VERIFICATION TESTS  ');
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
    // Setup 2 Demo Users & 1 Source Trip
    let ownerUser = await prisma.user.findFirst({ where: { email: 'owner@globetrotter.app' } });
    if (!ownerUser) {
      ownerUser = await prisma.user.create({
        data: {
          email: 'owner@globetrotter.app',
          passwordHash: 'dummyhash',
          name: 'Owner Travel Enthusiast',
        },
      });
    }

    let visitorUser = await prisma.user.findFirst({ where: { email: 'visitor@globetrotter.app' } });
    if (!visitorUser) {
      visitorUser = await prisma.user.create({
        data: {
          email: 'visitor@globetrotter.app',
          passwordHash: 'dummyhash',
          name: 'Visitor User',
        },
      });
    }

    const startDate = new Date('2026-11-01T00:00:00.000Z');
    const endDate = new Date('2026-11-07T00:00:00.000Z');

    const sourceTrip = await prisma.trip.create({
      data: {
        userId: ownerUser.id,
        name: 'Shared Tokyo & Kyoto Adventure',
        description: '7-day autumn trip to Japan',
        startDate,
        endDate,
        isPublic: false,
        stops: {
          create: [
            {
              destinationName: 'Shibuya Crossing',
              city: 'Tokyo',
              country: 'Japan',
              arrivalDate: startDate,
              departureDate: new Date('2026-11-04T00:00:00.000Z'),
              orderIndex: 0,
            },
          ],
        },
        sections: {
          create: [
            {
              title: 'Day 1: Tokyo Imperial Palace & Ginza',
              startDate,
              endDate: startDate,
              sectionBudget: 15000,
              items: {
                create: [
                  {
                    title: 'Tsukiji Outer Market Breakfast',
                    cost: 2500,
                    startTime: '08:00 AM',
                    date: startDate,
                  },
                ],
              },
            },
          ],
        },
        budget: {
          create: {
            totalBudget: 120000,
          },
        },
      },
    });

    assert(!!sourceTrip.id, 'Created source trip for public sharing test');

    // 1. Test Generate Share Link
    const shareResult = await PublicItineraryService.generateShareLink(ownerUser.id, sourceTrip.id);
    assert(
      !!shareResult.shareToken && shareResult.shareUrl.includes('/share/'),
      'generateShareLink creates active public token and URL'
    );

    const tripAfterShare = await prisma.trip.findUnique({ where: { id: sourceTrip.id } });
    assert(tripAfterShare?.isPublic === true, 'generateShareLink automatically updates trip.isPublic to true');

    // 2. Test Get Public Itinerary by Token (Public Read-Only Access)
    const publicData = await PublicItineraryService.getPublicItineraryByToken(shareResult.shareToken);
    assert(
      publicData.owner.name === 'Owner Travel Enthusiast' &&
        publicData.trip.name === 'Shared Tokyo & Kyoto Adventure' &&
        publicData.sections.length === 1 &&
        publicData.sections[0].items[0].title === 'Tsukiji Outer Market Breakfast',
      'getPublicItineraryByToken retrieves owner info, metadata, stops, sections, and items'
    );

    // 3. Test Get Public Itinerary by Trip ID
    const publicDataById = await PublicItineraryService.getPublicItineraryById(sourceTrip.id);
    assert(publicDataById.trip.id === sourceTrip.id, 'getPublicItineraryById retrieves public trip details');

    // 4. Test Copy Public Trip to Visitor User Workspace
    const copyResult = await PublicItineraryService.copyPublicTrip(visitorUser.id, shareResult.shareToken);
    assert(copyResult.success && !!copyResult.clonedTripId, 'copyPublicTrip clones public trip into visitor workspace');

    const clonedTrip = await prisma.trip.findUnique({
      where: { id: copyResult.clonedTripId },
      include: { stops: true, sections: { include: { items: true } }, budget: true },
    });

    assert(
      clonedTrip?.userId === visitorUser.id &&
        clonedTrip.name === 'Copy of Shared Tokyo & Kyoto Adventure' &&
        clonedTrip.isPublic === false &&
        clonedTrip.sections[0].items[0].title === 'Tsukiji Outer Market Breakfast' &&
        clonedTrip.budget?.totalBudget === 120000,
      'Cloned trip preserves trip stops, sections, items, and budget under new owner'
    );

    // 5. Test Revoke Share Link
    await PublicItineraryService.revokeShareLink(ownerUser.id, sourceTrip.id);
    let revokedAccessDenied = false;
    try {
      await PublicItineraryService.getPublicItineraryByToken(shareResult.shareToken);
    } catch (err: any) {
      revokedAccessDenied = err.statusCode === 404;
    }
    assert(revokedAccessDenied, 'revokeShareLink revokes public access token');

    // Cleanup test trips
    await prisma.trip.delete({ where: { id: sourceTrip.id } });
    await prisma.trip.delete({ where: { id: copyResult.clonedTripId } });

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

runModule11Tests();
