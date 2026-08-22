"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_js_1 = require("../controllers/uploadController.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_js_1.authMiddleware, uploadController_js_1.uploadImage);
exports.default = router;
