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
exports.updateBandProfile = exports.createBandProfile = exports.getBandById = exports.getBands = void 0;
const db_1 = require("../config/db");
const getBands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { genre, city, country, search } = req.query;
        let queryString = 'SELECT * FROM bands WHERE 1=1';
        const params = [];
        let paramIndex = 1;
        if (genre) {
            queryString += ` AND genre ILIKE $${paramIndex}`;
            params.push(`%${genre}%`);
            paramIndex++;
        }
        if (city) {
            queryString += ` AND city ILIKE $${paramIndex}`;
            params.push(`%${city}%`);
            paramIndex++;
        }
        if (country) {
            queryString += ` AND country ILIKE $${paramIndex}`;
            params.push(`%${country}%`);
            paramIndex++;
        }
        if (search) {
            queryString += ` AND (name ILIKE $${paramIndex} OR bio ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }
        queryString += ' ORDER BY created_at DESC';
        const result = yield (0, db_1.query)(queryString, params);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching bands:', error);
        res.status(500).json({ error: 'Server error fetching bands' });
    }
});
exports.getBands = getBands;
const getBandById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Get band details
        const bandResult = yield (0, db_1.query)('SELECT * FROM bands WHERE id = $1', [id]);
        if (bandResult.rows.length === 0) {
            res.status(404).json({ error: 'Band not found' });
            return;
        }
        const band = bandResult.rows[0];
        // Get band members
        const membersResult = yield (0, db_1.query)('SELECT * FROM band_members WHERE band_id = $1', [id]);
        band.members = membersResult.rows;
        res.json(band);
    }
    catch (error) {
        console.error('Error fetching band:', error);
        res.status(500).json({ error: 'Server error fetching band details' });
    }
});
exports.getBandById = getBandById;
const createBandProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, genre, location, country, city, bio, banner_image_url, band_image_url, social_links } = req.body;
        const user_id = req.user.id;
        // Check if user already has a band profile
        const existingBand = yield (0, db_1.query)('SELECT * FROM bands WHERE user_id = $1', [user_id]);
        if (existingBand.rows.length > 0) {
            res.status(400).json({ error: 'User already has a band profile' });
            return;
        }
        const newBand = yield (0, db_1.query)(`INSERT INTO bands (user_id, name, genre, location, country, city, bio, banner_image_url, band_image_url, social_links)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [user_id, name, genre, location, country, city, bio, banner_image_url, band_image_url, social_links || {}]);
        res.status(201).json(newBand.rows[0]);
    }
    catch (error) {
        console.error('Error creating band profile:', error);
        res.status(500).json({ error: 'Server error creating band profile' });
    }
});
exports.createBandProfile = createBandProfile;
const updateBandProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, genre, location, country, city, bio, banner_image_url, band_image_url, social_links } = req.body;
        const user_id = req.user.id;
        // Verify ownership
        const bandCheck = yield (0, db_1.query)('SELECT * FROM bands WHERE id = $1', [id]);
        if (bandCheck.rows.length === 0) {
            res.status(404).json({ error: 'Band not found' });
            return;
        }
        if (bandCheck.rows[0].user_id !== user_id) {
            res.status(403).json({ error: 'Not authorized to update this band profile' });
            return;
        }
        const updatedBand = yield (0, db_1.query)(`UPDATE bands SET
        name = COALESCE($1, name),
        genre = COALESCE($2, genre),
        location = COALESCE($3, location),
        country = COALESCE($4, country),
        city = COALESCE($5, city),
        bio = COALESCE($6, bio),
        banner_image_url = COALESCE($7, banner_image_url),
        band_image_url = COALESCE($8, band_image_url),
        social_links = COALESCE($9, social_links),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 RETURNING *`, [name, genre, location, country, city, bio, banner_image_url, band_image_url, social_links, id]);
        res.json(updatedBand.rows[0]);
    }
    catch (error) {
        console.error('Error updating band profile:', error);
        res.status(500).json({ error: 'Server error updating band profile' });
    }
});
exports.updateBandProfile = updateBandProfile;
