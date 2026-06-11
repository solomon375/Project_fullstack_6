const db = require('../config/db');

exports.getAllPosts = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM posts WHERE is_deleted = 0 ORDER BY id ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    const { title, body, user_id } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO posts (title, body, user_id) VALUES (?, ?, ?)',
            [title, body, user_id]
        );
        res.status(201).json({ id: result.insertId, title, body, user_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    const { title, body, userId } = req.body; // המשתמש שמבקש לערוך

    try {
        // בדיקת בעלות: שולפים את הפוסט כדי לבדוק למי הוא שייך
        const [post] = await db.execute('SELECT user_id FROM posts WHERE id = ? AND is_deleted = 0', [req.params.id]);
        
        if (post.length === 0) return res.status(404).json({ error: "Post not found" });
        if (post[0].user_id !== Number(userId)) {
            return res.status(403).json({ error: "Unauthorized: You can only edit your own posts" });
        }

        await db.execute('UPDATE posts SET title = ?, body = ? WHERE id = ?', [title, body, req.params.id]);
        res.json({ message: "Post updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    const { userId } = req.body; // המשתמש שמבקש למחוק

    try {
        // בדיקת בעלות
        const [post] = await db.execute('SELECT user_id FROM posts WHERE id = ? AND is_deleted = 0', [req.params.id]);
        
        if (post.length === 0) return res.status(404).json({ error: "Post not found" });
        if (post[0].user_id !== Number(userId)) {
            return res.status(403).json({ error: "Unauthorized: You can only delete your own posts" });
        }

        await db.execute('UPDATE posts SET is_deleted = 1 WHERE id = ?', [req.params.id]);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};