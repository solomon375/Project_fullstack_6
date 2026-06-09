const db = require('../config/db');

// שליפת כל הפוסטים (רק אלו שלא נמחקו)
exports.getAllPosts = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM posts WHERE is_deleted = 0');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// יצירת פוסט חדש
exports.createPost = async (req, res) => {
    const { title, body, user_id } = req.body;

    if (!title || !body || !user_id) {
        return res.status(400).json({ error: "Title, body, and user_id are required" });
    }

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

// עדכון פוסט - כולל וידוא בעלות
exports.updatePost = async (req, res) => {
    const postId = req.params.id;
    const { title, body, user_id } = req.body;

    try {
        // 1. מוודאים שהפוסט קיים ושייך למשתמש המבקש
        const [posts] = await db.execute('SELECT user_id FROM posts WHERE id = ? AND is_deleted = 0', [postId]);
        
        if (posts.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        if (posts[0].user_id !== user_id) {
            return res.status(403).json({ error: "Unauthorized: You can only edit your own posts" });
        }

        // 2. מבצעים את העדכון
        await db.execute(
            'UPDATE posts SET title = ?, body = ? WHERE id = ?',
            [title, body, postId]
        );
        res.json({ message: "Post updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// מחיקה רכה - כולל וידוא בעלות
exports.deletePost = async (req, res) => {
    const postId = req.params.id;
    const { user_id } = req.body; 

    try {
        // 1. מוודאים שהפוסט קיים ושייך למשתמש המבקש
        const [posts] = await db.execute('SELECT user_id FROM posts WHERE id = ? AND is_deleted = 0', [postId]);
        
        if (posts.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        if (posts[0].user_id !== user_id) {
            return res.status(403).json({ error: "Unauthorized: You can only delete your own posts" });
        }

        // 2. מחיקה רכה (Soft Delete)
        await db.execute('UPDATE posts SET is_deleted = 1 WHERE id = ?', [postId]);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};