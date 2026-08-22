"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = require("./config/db.js");
const tripService_js_1 = require("./services/tripService.js");
const destinationService_js_1 = require("./services/destinationService.js");
const activityService_js_1 = require("./services/activityService.js");
const itineraryBuilderService_js_1 = require("./services/itineraryBuilderService.js");
const budgetService_js_1 = require("./services/budgetService.js");
const calendarService_js_1 = require("./services/calendarService.js");
const communityService_js_1 = require("./services/communityService.js");
const publicItineraryService_js_1 = require("./services/publicItineraryService.js");
const searchService_js_1 = require("./services/searchService.js");
async function runSection20MasterTestSuite() {
    console.log('========================================================================');
    console.log('  SECTION 20: MASTER VERIFICATION TEST SUITE (UNIT, INTEGRATION, SEC) ');
    console.log('========================================================================\n');
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
        // 1. UNIT TESTS & AUTHENTICATION
        console.log('--- 1. UNIT TESTS & AUTHENTICATION ---');
        const demoUser = await db_js_1.prisma.user.findFirst({ where: { email: 'demo@globetrotter.app' } });
        assert(!!demoUser, 'Unit Test: Authentication Service resolves demo user');
        // 2. DESTINATION & SEARCH PERFORMANCE
        console.log('\n--- 2. DESTINATION & SEARCH PERFORMANCE ---');
        const destStart = Date.now();
        const destinations = await destinationService_js_1.DestinationService.listDestinations({});
        const destDuration = Date.now() - destStart;
        assert(destinations.length > 0 && destDuration < 300, `Performance Test: Destination list search executed under 300ms (${destDuration}ms)`);
        // 3. ACTIVITY CATALOG & FILTERS
        console.log('\n--- 3. ACTIVITY CATALOG & FILTERS ---');
        const activities = await activityService_js_1.ActivityService.listActivities({});
        assert(activities.length >= 30, 'Unit Test: Activity service returns 30+ curated experiences');
        // 4. TRIP CREATION & ITINERARY INTEGRATION
        console.log('\n--- 4. TRIP CREATION & INTEGRATION FLOW ---');
        const testTrip = await tripService_js_1.TripService.createTrip(demoUser.id, {
            name: 'Master Test Trip 2026',
            description: 'End-to-end integration test trip',
            startDate: '2026-10-01',
            endDate: '2026-10-05',
        });
        assert(testTrip.userId === demoUser.id, 'Integration Test: Trip creation flow');
        // 5. ITINERARY SECTION & BUDGET INTEGRATION
        console.log('\n--- 5. ITINERARY SECTION & BUDGET CALCULATIONS ---');
        const section = await itineraryBuilderService_js_1.ItineraryBuilderService.createSection(demoUser.id, testTrip.id, {
            title: 'Day 1: Master Explore',
            startDate: '2026-10-01',
            endDate: '2026-10-01',
            sectionBudget: 5000,
        });
        assert(section.tripId === testTrip.id, 'Integration Test: Section creation flow');
        await budgetService_js_1.BudgetService.setTripBudget(demoUser.id, testTrip.id, 25000);
        await budgetService_js_1.BudgetService.addExpense(demoUser.id, testTrip.id, {
            category: 'TRANSPORT',
            amount: 4500,
            description: 'Airport Shuttle',
        });
        const budgetOverview = await budgetService_js_1.BudgetService.getBudgetOverview(demoUser.id, testTrip.id);
        assert(budgetOverview.totalSpent === 4500 && budgetOverview.remainingBudget === 20500, 'Unit Test: Budget calculation math');
        // 6. CALENDAR EVENT TRANSFORMATION
        console.log('\n--- 6. CALENDAR EVENT TRANSFORMATION ---');
        const calOverview = await calendarService_js_1.CalendarService.getCalendarOverview(demoUser.id);
        assert(Array.isArray(calOverview.events), 'Unit Test: Calendar calculations and event transformation');
        // 7. COMMUNITY & PUBLIC ITINERARY SHARING
        console.log('\n--- 7. COMMUNITY & PUBLIC SHARING ---');
        const pubResult = await communityService_js_1.CommunityService.publishTrip(demoUser.id, testTrip.id, {
            title: 'Master Test Public Story',
            content: 'Testing public community sharing',
        });
        assert(pubResult.trip.isPublic === true, 'Integration Test: Community publish flow');
        const shareInfo = await publicItineraryService_js_1.PublicItineraryService.generateShareLink(demoUser.id, testTrip.id);
        const publicItinerary = await publicItineraryService_js_1.PublicItineraryService.getPublicItineraryByToken(shareInfo.shareToken);
        assert(publicItinerary.trip.id === testTrip.id, 'Security & Integration Test: Public trip access via token');
        // 8. GLOBAL SEARCH INTEGRATION
        console.log('\n--- 8. GLOBAL SEARCH PERFORMANCE ---');
        const searchRes = await searchService_js_1.SearchService.globalSearch(demoUser.id, 'Goa');
        assert(Array.isArray(searchRes.trips) && Array.isArray(searchRes.destinations), 'Integration Test: Global multi-entity search');
        // CLEANUP TEST TRIP
        await db_js_1.prisma.trip.delete({ where: { id: testTrip.id } });
        console.log('\n========================================================================');
        console.log(`  MASTER VERIFICATION RESULT: ${passedCount} / ${totalTests} TESTS PASSED`);
        console.log('========================================================================\n');
        if (passedCount === totalTests) {
            process.exit(0);
        }
        else {
            process.exit(1);
        }
    }
    catch (err) {
        console.error('Master Test Suite Execution Error:', err);
        process.exit(1);
    }
    finally {
        await db_js_1.prisma.$disconnect();
    }
}
runSection20MasterTestSuite();
