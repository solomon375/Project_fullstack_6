const db = require('../config/db');

exports.createPhoto = async (req, res) => {
    const { albumId, title, url, thumbnailUrl } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO photos (albumId, title, url, thumbnailUrl) VALUES (?, ?, ?, ?)',
            [albumId, title, url, thumbnailUrl]
        );
        res.status(201).json({ id: result.insertId, albumId, title, url, thumbnailUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePhoto = async (req, res) => {
    const { title } = req.body; // בדרך כלל מעדכנים רק כותרת, אפשר להרחיב
    try {
        await db.execute('UPDATE photos SET title = ? WHERE id = ?', [title, req.params.id]);
        res.json({ message: "Photo updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePhoto = async (req, res) => {
    try {
        await db.execute('UPDATE photos SET is_deleted = 1 WHERE id = ?', [req.params.id]);
        res.json({ message: "Photo deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};