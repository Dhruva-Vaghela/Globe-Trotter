"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const searchController_js_1 = require("../controllers/searchController.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_js_1.optionalAuthMiddleware, searchController_js_1.globalSearch);
exports.default = router;
