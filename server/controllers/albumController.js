const db = require('../config/db');

exports.createAlbum = async (req, res) => {
    const { title, userId } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO albums (title, userId) VALUES (?, ?)',
            [title, userId]
        );
        res.status(201).json({ id: result.insertId, title, userId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAlbumPhotos = async (req, res) => {
    const albumId = req.params.id;
    const limit = Number(req.query._limit) || 10;
    const page = Number(req.query._page) || 1;
    const offset = (page - 1) * limit;

    try {
        const [rows] = await db.execute(
            `SELECT * FROM photos WHERE albumId = ? AND is_deleted = 0 LIMIT ${limit} OFFSET ${offset}`, 
            [albumId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};