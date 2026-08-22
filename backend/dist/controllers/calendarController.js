"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarOverview = getCalendarOverview;
exports.getTripCalendar = getTripCalendar;
const calendarService_js_1 = require("../services/calendarService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const AppError_js_1 = require("../utils/AppError.js");
async function getCalendarOverview(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const start = req.query.start;
        const end = req.query.end;
        const calendar = await calendarService_js_1.CalendarService.getCalendarOverview(req.user.userId, start, end);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Calendar overview retrieved', calendar);
    }
    catch (err) {
        next(err);
    }
}
async function getTripCalendar(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const calendar = await calendarService_js_1.CalendarService.getTripCalendarData(req.user.userId, req.params.tripId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Trip calendar events retrieved', calendar);
    }
    catch (err) {
        next(err);
    }
}
