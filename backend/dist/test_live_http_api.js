"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const db_js_1 = require("./config/db.js");
const http_1 = __importDefault(require("http"));
async function testLiveHttpApi() {
    console.log('===========================================================');
    console.log('  STARTING LIVE HTTP API & BACKEND VERIFICATION FOR MODULE 5');
    console.log('===========================================================\n');
    // Start server on port 5099 for testing
    const PORT = 5099;
    const server = http_1.default.createServer(app_js_1.app);
    await new Promise((resolve) => {
        server.listen(PORT, () => {
            console.log(`📡 Live Test Server running on http://localhost:${PORT}`);
            resolve();
        });
    });
    const baseUrl = `http://localhost:${PORT}/api/v1`;
    let totalTests = 0;
    let passedTests = 0;
    function assert(condition, description) {
        totalTests++;
        if (condition) {
            console.log(`✅ [HTTP PASS] Test ${totalTests}: ${description}`);
            passedTests++;
        }
        else {
            console.error(`❌ [HTTP FAIL] Test ${totalTests}: ${description}`);
        }
    }
    try {
        // 1. GET /api/v1/activities (List activities)
        const res1 = await fetch(`${baseUrl}/activities`);
        const json1 = await res1.json();
        assert(res1.status === 200 && json1.success === true && Array.isArray(json1.data) && json1.data.length >= 30, `GET /api/v1/activities returned status 200 with ${json1.data?.length} activities`);
        // 2. GET /api/v1/activities with query parameters (search, maxCost, sortBy)
        const res2 = await fetch(`${baseUrl}/activities?search=Taj&maxCost=5000&sortBy=cost_asc`);
        const json2 = await res2.json();
        assert(res2.status === 200 && json2.success === true && json2.data.length > 0, `GET /api/v1/activities?search=Taj&maxCost=5000 returned status 200 with filtered results`);
        // 3. GET /api/v1/activities/:id (Activity Details)
        const firstActivityId = json1.data[0].id;
        const res3 = await fetch(`${baseUrl}/activities/${firstActivityId}`);
        const json3 = await res3.json();
        assert(res3.status === 200 &&
            json3.success === true &&
            json3.data.id === firstActivityId &&
            !!json3.data.durationBreakdown &&
            !!json3.data.locationMap, `GET /api/v1/activities/:id returned status 200 with durationBreakdown and locationMap`);
        // 4. Register/Login Demo User to obtain JWT Token for protected endpoints
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'demo@globetrotter.app', password: 'Password123!' }),
        });
        const loginJson = await loginRes.json();
        const token = loginJson.data?.token;
        assert(loginRes.status === 200 && !!token, `POST /api/v1/auth/login returned status 200 and valid JWT authentication token`);
        // 5. Fetch or create a user trip to get tripId and sectionId
        let tripRes = await fetch(`${baseUrl}/trips`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        let tripJson = await tripRes.json();
        let demoTrip = tripJson.data?.[0];
        if (!demoTrip) {
            const createTripRes = await fetch(`${baseUrl}/trips`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: 'Goa Summer Escape',
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
                    destinationCity: 'Goa',
                    destinationCountry: 'India',
                }),
            });
            const createTripJson = await createTripRes.json();
            demoTrip = createTripJson.data;
        }
        // Ensure section exists in DB directly if not returned
        let sectionId = demoTrip.sections?.[0]?.id;
        if (!sectionId) {
            const secInDb = await db_js_1.prisma.itinerarySection.findFirst({ where: { tripId: demoTrip.id } });
            if (secInDb) {
                sectionId = secInDb.id;
            }
            else {
                const createdSec = await db_js_1.prisma.itinerarySection.create({
                    data: {
                        tripId: demoTrip.id,
                        title: 'Day 1: Sightseeing Excursion',
                        startDate: new Date(),
                        endDate: new Date(),
                        orderIndex: 0,
                    },
                });
                sectionId = createdSec.id;
            }
        }
        // 6. POST /api/v1/trips/:tripId/sections/:sectionId/items (Attach activity)
        const addItemRes = await fetch(`${baseUrl}/trips/${demoTrip.id}/sections/${sectionId}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                activityId: firstActivityId,
                startTime: '11:00 AM',
                notes: 'Live HTTP Test Note',
            }),
        });
        const addItemJson = await addItemRes.json();
        const newItemId = addItemJson.data?.id;
        assert(addItemRes.status === 201 && addItemJson.success === true && !!newItemId, `POST /api/v1/trips/:tripId/sections/:sectionId/items created ItineraryItem (status 201)`);
        // 7. PUT /api/v1/trips/:tripId/sections/:sectionId/items/reorder (Reorder items)
        const reorderRes = await fetch(`${baseUrl}/trips/${demoTrip.id}/sections/${sectionId}/items/reorder`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ itemIds: [newItemId] }),
        });
        const reorderJson = await reorderRes.json();
        assert(reorderRes.status === 200 && reorderJson.success === true, `PUT /api/v1/trips/:tripId/sections/:sectionId/items/reorder reordered items (status 200)`);
        // 8. DELETE /api/v1/trips/:tripId/items/:itemId (Delete item)
        const deleteRes = await fetch(`${baseUrl}/trips/${demoTrip.id}/items/${newItemId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        const deleteJson = await deleteRes.json();
        assert(deleteRes.status === 200 && deleteJson.success === true, `DELETE /api/v1/trips/:tripId/items/:itemId deleted item (status 200)`);
        console.log('\n===========================================================');
        console.log(`  LIVE HTTP VERIFICATION COMPLETE: ${passedTests} / ${totalTests} PASSED`);
        console.log('===========================================================\n');
    }
    catch (err) {
        console.error('HTTP Verification error:', err);
    }
    finally {
        server.close();
        await db_js_1.prisma.$disconnect();
    }
}
testLiveHttpApi();
