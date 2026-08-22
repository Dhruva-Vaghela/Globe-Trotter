"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const destinationController_js_1 = require("../controllers/destinationController.js");
const router = (0, express_1.Router)();
router.get('/', destinationController_js_1.getDestinations);
router.get('/:id', destinationController_js_1.getDestination);
exports.default = router;
