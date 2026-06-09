const db = require('../config/db');

exports.getUserTodos = async (req, res) => {
    const userId = req.params.id;
    let query = 'SELECT * FROM todos WHERE user_id = ? AND is_deleted = 0';
    
    if (req.query._sort === 'id' && req.query._order === 'desc') query += ' ORDER BY id DESC';
    if (req.query._limit) query += ` LIMIT ${Number(req.query._limit)}`;

    try {
        const [rows] = await db.execute(query, [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserPosts = async (req, res) => {
    const userId = req.params.id;
    let query = 'SELECT * FROM posts WHERE user_id = ? AND is_deleted = 0';
    
    if (req.query._sort === 'id' && req.query._order === 'desc') query += ' ORDER BY id DESC';
    if (req.query._limit) query += ` LIMIT ${Number(req.query._limit)}`;

    try {
        const [rows] = await db.execute(query, [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserAlbums = async (req, res) => {
    const userId = req.params.id;
    let query = 'SELECT * FROM albums WHERE userId = ? AND is_deleted = 0';
    
    if (req.query._sort === 'id' && req.query._order === 'desc') query += ' ORDER BY id DESC';
    if (req.query._limit) query += ` LIMIT ${Number(req.query._limit)}`;

    try {
        const [rows] = await db.execute(query, [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};