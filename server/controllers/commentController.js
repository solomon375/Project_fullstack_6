const db = require('../config/db');

exports.getPostComments = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM comments WHERE postId = ? AND is_deleted = 0', [req.params.postId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createComment = async (req, res) => {
    const { postId, body, email } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO comments (postId, body, email) VALUES (?, ?, ?)',
            [postId, body, email]
        );
        res.status(201).json({ id: result.insertId, postId, body, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateComment = async (req, res) => {
    const { body } = req.body;
    try {
        await db.execute('UPDATE comments SET body = ? WHERE id = ?', [body, req.params.id]);
        res.json({ message: "Comment updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        await db.execute('UPDATE comments SET is_deleted = 1 WHERE id = ?', [req.params.id]);
        res.json({ message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};