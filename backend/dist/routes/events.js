"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const events_1 = require("../controllers/events");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/', events_1.getEvents);
router.get('/:id', events_1.getEventById);
// Protected band routes
router.post('/', auth_1.authenticateToken, auth_1.requireBandRole, events_1.createEvent);
exports.default = router;
