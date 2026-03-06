"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_1 = require("../controllers/posts");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/', posts_1.getPosts);
// Protected band routes
router.post('/', auth_1.authenticateToken, auth_1.requireBandRole, posts_1.createPost);
exports.default = router;
