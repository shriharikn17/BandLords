"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = exports.getPosts = void 0;
const db_1 = require("../config/db");
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { band_id } = req.query;
        let queryString = 'SELECT p.*, b.name as band_name, b.band_image_url FROM posts p JOIN bands b ON p.band_id = b.id WHERE 1=1';
        const params = [];
        let paramIndex = 1;
        if (band_id) {
            queryString += ` AND p.band_id = $${paramIndex}`;
            params.push(band_id);
            paramIndex++;
        }
        queryString += ' ORDER BY p.created_at DESC';
        const result = yield (0, db_1.query)(queryString, params);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Server error fetching posts' });
    }
});
exports.getPosts = getPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, content, image_url } = req.body;
        const user_id = req.user.id;
        // Get band id for the current user
        const bandResult = yield (0, db_1.query)('SELECT id FROM bands WHERE user_id = $1', [user_id]);
        if (bandResult.rows.length === 0) {
            res.status(403).json({ error: 'Only bands can create posts' });
            return;
        }
        const band_id = bandResult.rows[0].id;
        const newPost = yield (0, db_1.query)(`INSERT INTO posts (band_id, type, content, image_url)
       VALUES ($1, $2, $3, $4) RETURNING *`, [band_id, type || 'announcement', content, image_url]);
        res.status(201).json(newPost.rows[0]);
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Server error creating post' });
    }
});
exports.createPost = createPost;
