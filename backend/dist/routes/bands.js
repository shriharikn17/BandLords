"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bands_1 = require("../controllers/bands");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/', bands_1.getBands);
router.get('/:id', bands_1.getBandById);
// Protected band routes
router.post('/', auth_1.authenticateToken, auth_1.requireBandRole, bands_1.createBandProfile);
router.put('/:id', auth_1.authenticateToken, auth_1.requireBandRole, bands_1.updateBandProfile);
exports.default = router;
