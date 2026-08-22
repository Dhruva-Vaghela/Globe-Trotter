"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalSearch = globalSearch;
const searchService_js_1 = require("../services/searchService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
async function globalSearch(req, res, next) {
    try {
        const q = req.query.q;
        const userId = req.user?.userId;
        const results = await searchService_js_1.SearchService.globalSearch(q || '', userId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Global search executed successfully', results);
    }
    catch (err) {
        next(err);
    }
}
