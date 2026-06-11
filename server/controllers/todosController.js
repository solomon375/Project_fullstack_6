const db = require('../config/db');

// שליפת כל המשימות - מסודרות לפי ID (בהתאם לדרישת הסילבוס)
exports.getAllTodos = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM todos WHERE is_deleted = 0 ORDER BY id ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// יצירת משימה חדשה
exports.createTodo = async (req, res) => {
    const { title, user_id, completed } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO todos (title, user_id, completed) VALUES (?, ?, ?)',
            [title, user_id, completed ? 1 : 0]
        );
        res.status(201).json({ id: result.insertId, title, user_id, completed: completed ? 1 : 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// עדכון משימה (זה מה שהיה חסר וגרם לקריסה!)
exports.updateTodo = async (req, res) => {
    const todoId = req.params.id;
    const { title, completed } = req.body;

    try {
        // בודקים אם שלחו לנו גם כותרת וגם סטטוס ביצוע
        if (title !== undefined && completed !== undefined) {
            await db.execute(
                'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
                [title, completed ? 1 : 0, todoId]
            );
        } else if (completed !== undefined) {
            // אם שלחו רק עדכון של מצב ה-Checkbox
            await db.execute(
                'UPDATE todos SET completed = ? WHERE id = ?',
                [completed ? 1 : 0, todoId]
            );
        } else if (title !== undefined) {
            // אם שלחו רק עדכון של הכותרת
            await db.execute(
                'UPDATE todos SET title = ? WHERE id = ?',
                [title, todoId]
            );
        }
        
        res.json({ message: "Todo updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// מחיקה רכה (Soft Delete)
exports.deleteTodo = async (req, res) => {
    const todoId = req.params.id;

    try {
        await db.execute('UPDATE todos SET is_deleted = 1 WHERE id = ?', [todoId]);
        res.json({ message: "Todo deleted successfully (soft delete)" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};