const db = require('../config/db');

// --- הפונקציות הקיימות שלך ---

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

// --- הפונקציות החדשות (הגדרות חשבון ומנהל) ---

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    try {
        if (password) {
            await db.execute(
                'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
                [name, email, password, userId]
            );
        } else {
            await db.execute(
                'UPDATE users SET name = ?, email = ? WHERE id = ?',
                [name, email, userId]
            );
        }
        res.json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, is_deleted, is_admin FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.toggleBlockUser = async (req, res) => {
    const targetUserId = req.params.id;
    const { is_deleted } = req.body;

    // הופכים את הערך למספר (0 או 1) באופן מפורש.
    // אם הערך הוא 1 (או "1"), הפונקציה תחזיר 1. בכל מקרה אחר - 0.
    const blockStatus = Number(is_deleted) === 1 ? 1 : 0;

    try {
        await db.execute('UPDATE users SET is_deleted = ? WHERE id = ?', [blockStatus, targetUserId]);
        res.json({ message: `User status securely updated to ${blockStatus}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};