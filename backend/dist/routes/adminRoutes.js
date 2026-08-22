"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_js_1 = require("../controllers/adminController.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const adminMiddleware_js_1 = require("../middlewares/adminMiddleware.js");
const validateMiddleware_js_1 = require("../middlewares/validateMiddleware.js");
const router = (0, express_1.Router)();
// Protect all admin routes with authMiddleware and adminMiddleware
router.use(authMiddleware_js_1.authMiddleware, adminMiddleware_js_1.adminMiddleware);
router.get('/analytics', adminController_js_1.getDashboardAnalytics);
router.get('/popular', adminController_js_1.getPopularItems);
router.get('/users', adminController_js_1.listUsers);
router.put('/users/:userId/role', (0, validateMiddleware_js_1.validate)(adminController_js_1.updateUserRoleSchema), adminController_js_1.updateUserRole);
router.delete('/users/:userId', adminController_js_1.deleteUser);
exports.default = router;
