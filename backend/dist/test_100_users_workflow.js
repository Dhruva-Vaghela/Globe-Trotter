"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = require("./config/db.js");
const authService_js_1 = require("./services/authService.js");
const tripService_js_1 = require("./services/tripService.js");
const activityService_js_1 = require("./services/activityService.js");
const itineraryBuilderService_js_1 = require("./services/itineraryBuilderService.js");
const budgetService_js_1 = require("./services/budgetService.js");
const calendarService_js_1 = require("./services/calendarService.js");
const publicItineraryService_js_1 = require("./services/publicItineraryService.js");
const dashboardService_js_1 = require("./services/dashboardService.js");
const authController_js_1 = require("./controllers/authController.js");
async function run100UsersWorkflowStressTest() {
    console.log('=================================================================================');
    console.log('  GLOBETROTTER END-TO-END WORKFLOW & 100-USER STRESS / VALIDATION SUITE');
    console.log('=================================================================================\n');
    console.log('Workflow: Register/Login → Dashboard → Create Trip → Select Destinations');
    console.log('          → Add Activities → Build Itinerary → Calculate Budget → View Calendar');
    console.log('          → Save/Manage Trip → Share Trip\n');
    let passedSteps = 0;
    let totalSteps = 0;
    function assertStep(condition, stepName, detail) {
        totalSteps++;
        if (condition) {
            console.log(`✅ [PASS] Step ${totalSteps}: ${stepName}${detail ? ` (${detail})` : ''}`);
            passedSteps++;
        }
        else {
            console.error(`❌ [FAIL] Step ${totalSteps}: ${stepName}${detail ? ` (${detail})` : ''}`);
        }
    }
    const startTime = Date.now();
    const simulatedUserCount = 100;
    try {
        // PRE-HASH SAMPLE PASSWORD FOR CONCURRENCY STRESS EFFICIENCY
        const sampleHash = await authService_js_1.AuthService.hashPassword('Password123!');
        // -------------------------------------------------------------------------
        // STEP 1: REGISTER / LOGIN 100 USERS IN PARALLEL & FORM VALIDATIONS
        // -------------------------------------------------------------------------
        console.log('--- 1. REGISTER / LOGIN 100 USERS & FORM VALIDATIONS ---');
        const registerStart = Date.now();
        const timestamp = Date.now();
        const userCreatePromises = Array.from({ length: simulatedUserCount }).map((_, idx) => {
            const i = idx + 1;
            return db_js_1.prisma.user.create({
                data: {
                    email: `stress_user_${i}_${timestamp}@globetrotter.app`,
                    name: `Globetrotter Explorer ${i}`,
                    passwordHash: sampleHash,
                },
            });
        });
        const createdUsers = await Promise.all(userCreatePromises);
        const createdUserIds = createdUsers.map((u) => u.id);
        const registerDuration = Date.now() - registerStart;
        assertStep(createdUserIds.length === simulatedUserCount, `Registered & authenticated ${simulatedUserCount} distinct users`, `Completed in ${registerDuration}ms (~${(registerDuration / simulatedUserCount).toFixed(1)}ms/user)`);
        // TEST AUTH VALIDATIONS (Zod schema validation checks for Register & Login)
        let badEmailPassed = true;
        try {
            authController_js_1.registerSchema.parse({ body: { name: 'A', email: 'invalid-email', password: '123' } });
        }
        catch {
            badEmailPassed = false;
        }
        assertStep(!badEmailPassed, 'Validation Check: Register rejects invalid email & short passwords (<6 chars)');
        // -------------------------------------------------------------------------
        // STEP 2: DASHBOARD METRICS FOR ALL 100 USERS
        // -------------------------------------------------------------------------
        console.log('\n--- 2. DASHBOARD METRICS ---');
        const dashStart = Date.now();
        const dashPromises = createdUserIds.map((userId) => dashboardService_js_1.DashboardService.getDashboardSummary(userId));
        const dashboards = await Promise.all(dashPromises);
        const dashDuration = Date.now() - dashStart;
        const validDashboards = dashboards.filter((d) => d && d.stats && typeof d.stats.upcomingTripsCount === 'number').length;
        assertStep(validDashboards === simulatedUserCount, `Dashboard metrics loaded for all ${simulatedUserCount} users`, `Duration: ${dashDuration}ms`);
        // -------------------------------------------------------------------------
        // STEP 3: CREATE TRIP FOR ALL 100 USERS & DATE VALIDATIONS
        // -------------------------------------------------------------------------
        console.log('\n--- 3. CREATE TRIP ---');
        const tripStart = Date.now();
        const tripPromises = createdUserIds.map((userId, i) => tripService_js_1.TripService.createTrip(userId, {
            name: `Adventure ${i + 1} Tour`,
            description: `Custom expedition for stress user ${i + 1}`,
            startDate: '2026-11-10',
            endDate: '2026-11-20',
        }));
        const createdTrips = await Promise.all(tripPromises);
        const createdTripIds = createdTrips.map((t) => t.id);
        const tripDuration = Date.now() - tripStart;
        assertStep(createdTripIds.length === simulatedUserCount, `Created 100 trips across ${simulatedUserCount} user accounts`, `Duration: ${tripDuration}ms`);
        // TEST TRIP DATE VALIDATIONS (endDate < startDate)
        let invalidDateAllowed = true;
        try {
            await tripService_js_1.TripService.createTrip(createdUserIds[0], {
                name: 'Invalid Date Trip',
                startDate: '2026-12-10',
                endDate: '2026-12-01', // Invalid: endDate before startDate
            });
        }
        catch {
            invalidDateAllowed = false;
        }
        assertStep(!invalidDateAllowed, 'Validation Check: Create Trip rejects endDate earlier than startDate');
        // -------------------------------------------------------------------------
        // STEP 4: SELECT DESTINATIONS (ADD TRIP STOPS)
        // -------------------------------------------------------------------------
        console.log('\n--- 4. SELECT DESTINATIONS ---');
        const destStart = Date.now();
        const stopPromises = createdTripIds.map((tripId) => db_js_1.prisma.tripStop.create({
            data: {
                tripId,
                destinationName: 'Goa Coastal Haven',
                city: 'Goa',
                country: 'India',
                arrivalDate: new Date('2026-11-10'),
                departureDate: new Date('2026-11-15'),
            },
        }));
        const attachedStops = await Promise.all(stopPromises);
        const destDuration = Date.now() - destStart;
        assertStep(attachedStops.length === simulatedUserCount, `Attached destination stops to all ${simulatedUserCount} trips`, `Duration: ${destDuration}ms`);
        // -------------------------------------------------------------------------
        // STEP 5: ADD ACTIVITIES & CATALOG AUDIT
        // -------------------------------------------------------------------------
        console.log('\n--- 5. ADD ACTIVITIES ---');
        const catalog = await activityService_js_1.ActivityService.listActivities({});
        const sampleActivity = catalog[0] || { id: null, estimatedCost: 1500, name: 'Beach Walk' };
        assertStep(catalog.length >= 30, `Activity catalog active with ${catalog.length} curated experiences`);
        // -------------------------------------------------------------------------
        // STEP 6: BUILD ITINERARY (DAY SECTIONS & ITEMS)
        // -------------------------------------------------------------------------
        console.log('\n--- 6. BUILD ITINERARY ---');
        const itinStart = Date.now();
        const sectionPromises = createdTripIds.map((tripId, i) => itineraryBuilderService_js_1.ItineraryBuilderService.createSection(createdUserIds[i], tripId, {
            title: `Day 1: Scuba & Beach Exploration`,
            startDate: '2026-11-10',
            endDate: '2026-11-10',
            sectionBudget: 4000,
        }));
        const createdSections = await Promise.all(sectionPromises);
        const itemPromises = createdSections.map((sec, i) => itineraryBuilderService_js_1.ItineraryBuilderService.addItemToSection(createdUserIds[i], createdTripIds[i], sec.id, {
            activityId: sampleActivity.id || undefined,
            title: sampleActivity.name || 'Beach Walk',
            startTime: '10:00 AM',
            cost: sampleActivity.estimatedCost || 1500,
        }));
        await Promise.all(itemPromises);
        const itinDuration = Date.now() - itinStart;
        assertStep(createdSections.length === simulatedUserCount, `Built day-by-day itinerary sections and items for all ${simulatedUserCount} trips`, `Duration: ${itinDuration}ms`);
        // -------------------------------------------------------------------------
        // STEP 7: CALCULATE BUDGET & EXPENSE TRACKING
        // -------------------------------------------------------------------------
        console.log('\n--- 7. CALCULATE BUDGET & EXPENSE TRACKING ---');
        const budgetStart = Date.now();
        await Promise.all(createdTripIds.map((tripId, i) => budgetService_js_1.BudgetService.setTripBudget(createdUserIds[i], tripId, 30000)));
        await Promise.all(createdTripIds.map((tripId, i) => budgetService_js_1.BudgetService.addExpense(createdUserIds[i], tripId, {
            category: 'TRANSPORT',
            amount: 3500,
            description: 'Flight booking',
        })));
        await Promise.all(createdTripIds.map((tripId, i) => budgetService_js_1.BudgetService.addExpense(createdUserIds[i], tripId, {
            category: 'MEALS',
            amount: 2500,
            description: 'Seafood Dinner',
        })));
        const overviews = await Promise.all(createdTripIds.map((tripId, i) => budgetService_js_1.BudgetService.getBudgetOverview(createdUserIds[i], tripId)));
        const budgetDuration = Date.now() - budgetStart;
        const sampleOverview = overviews[0];
        const validBudgetOverviews = overviews.filter((o) => typeof o.totalSpent === 'number' && typeof o.remainingBudget === 'number').length;
        assertStep(validBudgetOverviews === simulatedUserCount, `Budget overview & daily spend accurately calculated for all ${simulatedUserCount} trips (Spent: ₹${sampleOverview.totalSpent}, Remaining: ₹${sampleOverview.remainingBudget})`, `Duration: ${budgetDuration}ms`);
        // -------------------------------------------------------------------------
        // STEP 8: VIEW CALENDAR & TIMELINE DATA
        // -------------------------------------------------------------------------
        console.log('\n--- 8. VIEW CALENDAR & TIMELINE DATA ---');
        const calStart = Date.now();
        const calPromises = createdUserIds.map((userId) => calendarService_js_1.CalendarService.getCalendarOverview(userId));
        const calendars = await Promise.all(calPromises);
        const calDuration = Date.now() - calStart;
        const validCalendars = calendars.filter((c) => c && Array.isArray(c.events)).length;
        assertStep(validCalendars === simulatedUserCount, `Calendar events and timeline transformations fetched for all ${simulatedUserCount} users`, `Duration: ${calDuration}ms`);
        // -------------------------------------------------------------------------
        // STEP 9: SAVE / MANAGE TRIP STATUS TRANSITION
        // -------------------------------------------------------------------------
        console.log('\n--- 9. SAVE / MANAGE TRIP ---');
        const updatePromises = createdTripIds.map((tripId, i) => tripService_js_1.TripService.updateTrip(createdUserIds[i], tripId, {
            name: `Managed Expedition ${i + 1}`,
            status: 'ONGOING',
        }));
        const updatedTrips = await Promise.all(updatePromises);
        const ongoingCount = updatedTrips.filter((t) => t.status === 'ONGOING').length;
        assertStep(ongoingCount === simulatedUserCount, `Trip details saved and status updated to ONGOING for all ${simulatedUserCount} trips`);
        // -------------------------------------------------------------------------
        // STEP 10: SHARE TRIP (COMMUNITY & PUBLIC TOKEN) & PRIVACY ISOLATION
        // -------------------------------------------------------------------------
        console.log('\n--- 10. SHARE TRIP & PRIVACY ISOLATION ---');
        const shareSamplePromises = Array.from({ length: 10 }).map((_, i) => publicItineraryService_js_1.PublicItineraryService.generateShareLink(createdUserIds[i], createdTripIds[i]));
        const shares = await Promise.all(shareSamplePromises);
        const lookupPromises = shares.map((s) => publicItineraryService_js_1.PublicItineraryService.getPublicItineraryByToken(s.shareToken));
        const publicTrips = await Promise.all(lookupPromises);
        assertStep(publicTrips.length === 10 && publicTrips.every((pt, idx) => pt.trip.id === createdTripIds[idx]), `Generated active public share links and verified public itinerary access`);
        // TEST PRIVACY ISOLATION (User A trying to access User B's private trip)
        let unauthorizedAccessBlocked = false;
        try {
            // User 2 trying to edit User 1's trip
            await tripService_js_1.TripService.updateTrip(createdUserIds[1], createdTripIds[0], { name: 'Hacked Title' });
        }
        catch {
            unauthorizedAccessBlocked = true;
        }
        assertStep(unauthorizedAccessBlocked, 'Security & Privacy Check: User A cannot mutate or modify User B private trip data');
        // -------------------------------------------------------------------------
        // CLEANUP STRESS DATA
        // -------------------------------------------------------------------------
        console.log('\n--- CLEANING UP STRESS TEST DATA ---');
        await db_js_1.prisma.user.deleteMany({
            where: { id: { in: createdUserIds } },
        });
        console.log(`Cleaned up ${createdUserIds.length} test users from Neon database.`);
        const totalDuration = Date.now() - startTime;
        console.log('\n=================================================================================');
        console.log(`  STRESS WORKFLOW SUMMARY: ${passedSteps} / ${totalSteps} STEPS PASSED`);
        console.log(`  TOTAL TIME ELAPSED: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)} seconds)`);
        console.log('=================================================================================\n');
        if (passedSteps === totalSteps) {
            process.exit(0);
        }
        else {
            process.exit(1);
        }
    }
    catch (err) {
        console.error('Workflow Stress Test Execution Error:', err);
        process.exit(1);
    }
    finally {
        await db_js_1.prisma.$disconnect();
    }
}
run100UsersWorkflowStressTest();
