"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = require("./config/db.js");
const activityService_js_1 = require("./services/activityService.js");
async function runModule5Tests() {
    console.log('====================================================');
    console.log('  STARTING MODULE 5 (ACTIVITY HUB) VERIFICATION TESTS ');
    console.log('====================================================\n');
    let passedCount = 0;
    let totalTests = 0;
    function assert(condition, testName) {
        totalTests++;
        if (condition) {
            console.log(`✅ [PASS] Test ${totalTests}: ${testName}`);
            passedCount++;
        }
        else {
            console.error(`❌ [FAIL] Test ${totalTests}: ${testName}`);
        }
    }
    try {
        // 1. Verify Seed Data (30+ activities in Neon PostgreSQL)
        const count = await db_js_1.prisma.activity.count();
        assert(count >= 30, `Database populated with 30+ activities (Found: ${count})`);
        // 2. Test GET /api/v1/activities (list & filtering)
        const allActivities = await activityService_js_1.ActivityService.listActivities({});
        assert(allActivities.length >= 30, `listActivities({}) returns full activity catalog (${allActivities.length} items)`);
        const searchResult = await activityService_js_1.ActivityService.listActivities({ search: 'Scuba' });
        assert(searchResult.length > 0 && searchResult.some((a) => a.name.includes('Scuba')), 'listActivities({ search: "Scuba" }) returns matching Scuba activity');
        const foodCat = await db_js_1.prisma.activityCategory.findUnique({ where: { name: 'Food & Dining' } });
        if (foodCat) {
            const foodActivities = await activityService_js_1.ActivityService.listActivities({ category: foodCat.id });
            assert(foodActivities.length > 0 && foodActivities.every((a) => a.categoryId === foodCat.id), 'listActivities({ category: categoryId }) correctly filters by category ID');
        }
        const budgetActivities = await activityService_js_1.ActivityService.listActivities({ maxCost: 1500 });
        assert(budgetActivities.length > 0 && budgetActivities.every((a) => a.estimatedCost <= 1500), 'listActivities({ maxCost: 1500 }) correctly filters by max cost');
        const sortedActivities = await activityService_js_1.ActivityService.listActivities({ sortBy: 'cost_asc' });
        let isSorted = true;
        for (let i = 1; i < sortedActivities.length; i++) {
            if (sortedActivities[i].estimatedCost < sortedActivities[i - 1].estimatedCost) {
                isSorted = false;
                break;
            }
        }
        assert(isSorted, 'listActivities({ sortBy: "cost_asc" }) correctly sorts activities ascending by price');
        // 3. Test GET /api/v1/activities/:id (details, location map, duration breakdown)
        const targetActivity = allActivities[0];
        const details = await activityService_js_1.ActivityService.getActivityById(targetActivity.id);
        assert(details.id === targetActivity.id &&
            !!details.durationBreakdown &&
            !!details.durationBreakdown.formatted &&
            !!details.locationMap, 'getActivityById(id) returns detailed activity with duration breakdown and location map');
        // 4. Test POST /api/v1/trips/:tripId/sections/:sectionId/items (Add activity to day itinerary section)
        const demoUser = await db_js_1.prisma.user.findFirst({ where: { email: 'demo@globetrotter.app' } });
        if (!demoUser)
            throw new Error('Demo user not found');
        let demoTrip = await db_js_1.prisma.trip.findFirst({
            where: { userId: demoUser.id },
            include: { sections: true },
        });
        if (!demoTrip) {
            demoTrip = await db_js_1.prisma.trip.create({
                data: {
                    userId: demoUser.id,
                    name: 'Test Activity Trip',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 86400000),
                    sections: {
                        create: [{ title: 'Day 1: Activity Excursions', startDate: new Date(), endDate: new Date(), orderIndex: 0 }],
                    },
                },
                include: { sections: true },
            });
        }
        if (demoTrip.sections.length === 0) {
            const newSec = await db_js_1.prisma.itinerarySection.create({
                data: {
                    tripId: demoTrip.id,
                    title: 'Day 1: Activity Excursions',
                    startDate: new Date(),
                    endDate: new Date(),
                    orderIndex: 0,
                },
            });
            demoTrip.sections.push(newSec);
        }
        const sectionId = demoTrip.sections[0].id;
        const newItem1 = await activityService_js_1.ActivityService.addActivityToSection(demoUser.id, demoTrip.id, sectionId, {
            activityId: targetActivity.id,
            title: targetActivity.name,
            cost: targetActivity.estimatedCost,
            startTime: '10:00 AM',
            notes: 'Test attachment 1',
        });
        assert(newItem1.id !== undefined && newItem1.sectionId === sectionId && newItem1.title === targetActivity.name, 'addActivityToSection() successfully creates ItineraryItem attached to ItinerarySection');
        const newItem2 = await activityService_js_1.ActivityService.addActivityToSection(demoUser.id, demoTrip.id, sectionId, {
            title: 'Custom Evening Walk',
            cost: 500,
            startTime: '06:00 PM',
            notes: 'Test attachment 2',
        });
        assert(newItem2.id !== undefined && newItem2.orderIndex === newItem1.orderIndex + 1, 'addActivityToSection() auto-increments orderIndex for subsequent items in section');
        // 5. Test PUT /api/v1/trips/:tripId/sections/:sectionId/items/reorder (Reorder itinerary items)
        const reordered = await activityService_js_1.ActivityService.reorderItineraryItems(demoUser.id, demoTrip.id, sectionId, [
            newItem2.id,
            newItem1.id,
        ]);
        const item2After = reordered.find((i) => i.id === newItem2.id);
        const item1After = reordered.find((i) => i.id === newItem1.id);
        assert(item2After?.orderIndex === 0 && item1After?.orderIndex === 1, 'reorderItineraryItems() correctly updates item orderIndex positions');
        // 6. Test DELETE /api/v1/trips/:tripId/items/:itemId (Remove activity item)
        await activityService_js_1.ActivityService.removeItineraryItem(demoUser.id, demoTrip.id, newItem1.id);
        await activityService_js_1.ActivityService.removeItineraryItem(demoUser.id, demoTrip.id, newItem2.id);
        const checkDeleted = await db_js_1.prisma.itineraryItem.findUnique({ where: { id: newItem1.id } });
        assert(checkDeleted === null, 'removeItineraryItem() successfully deletes ItineraryItem from PostgreSQL');
        console.log('\n====================================================');
        console.log(`  RESULTS: ${passedCount} / ${totalTests} TESTS PASSED`);
        console.log('====================================================\n');
        if (passedCount === totalTests) {
            process.exit(0);
        }
        else {
            process.exit(1);
        }
    }
    catch (err) {
        console.error('Test execution failed with exception:', err);
        process.exit(1);
    }
    finally {
        await db_js_1.prisma.$disconnect();
    }
}
runModule5Tests();
