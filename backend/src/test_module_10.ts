import { prisma } from './config/db.js';
import { CommunityService } from './services/communityService.js';

async function runModule10Tests() {
  console.log('===========================================================');
  console.log('  STARTING MODULE 10 (COMMUNITY FEED) VERIFICATION TESTS ');
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

    let demoTrip = await prisma.trip.findFirst({ where: { userId: demoUser.id } });
    if (!demoTrip) {
      demoTrip = await prisma.trip.create({
        data: {
          userId: demoUser.id,
          name: 'Goa Coastal Escape',
          description: '4 Days in North Goa beaches and forts',
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000 * 4),
        },
      });
    }

    // 1. Test publishTrip()
    const pubResult = await CommunityService.publishTrip(demoUser.id, demoTrip.id, {
      title: 'Awesome Goa Beach Excursion',
      content: 'Shared community story about sunset cruises and seafood.',
    });
    assert(
      pubResult.trip.isPublic === true && pubResult.post.isPublished === true,
      'publishTrip() updates trip.isPublic to true and creates published CommunityPost'
    );

    // 2. Test getCommunityFeed()
    const feed = await CommunityService.getCommunityFeed({});
    assert(
      Array.isArray(feed) && feed.length > 0 && feed.some((p) => p.id === demoTrip.id),
      'getCommunityFeed() returns feed containing published public trip'
    );

    // 3. Test getPublicTripDetails()
    const publicDetails = await CommunityService.getPublicTripDetails(demoTrip.id);
    assert(
      publicDetails.id === demoTrip.id && publicDetails.isPublic === true,
      'getPublicTripDetails() returns full public trip details'
    );

    // 4. Test copyTrip()
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const copierUserId = adminUser ? adminUser.id : demoUser.id;

    const copiedTrip = await CommunityService.copyTrip(copierUserId, demoTrip.id);
    assert(
      copiedTrip.name.includes(`Copy of ${demoTrip.name}`) && copiedTrip.userId === copierUserId,
      'copyTrip() duplicates public trip to authenticated user account'
    );

    // Clean up copied trip
    await prisma.trip.delete({ where: { id: copiedTrip.id } });

    // 5. Test unpublishTrip()
    const unpublished = await CommunityService.unpublishTrip(demoUser.id, demoTrip.id);
    assert(unpublished.isPublic === false, 'unpublishTrip() sets trip.isPublic to false');

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

runModule10Tests();
