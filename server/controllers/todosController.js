const db = require('../config/db');

// שליפת משימות (רק כאלו שלא נמחקו!)
exports.getAllTodos = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM todos WHERE is_deleted = 0');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// יצירת משימה חדשה (כולל ולידציה בצד שרת)
exports.createTodo = async (req, res) => {
    const { title, user_id } = req.body;

    // ולידציה - השרת מוודא שהמידע תקין גם אם הלקוח שלח משהו ריק
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO todos (title, user_id) VALUES (?, ?)',
            [title, user_id]
        );
        res.status(201).json({ id: result.insertId, title, completed: 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// מחיקה רכה (Soft Delete)
exports.deleteTodo = async (req, res) => {
    const todoId = req.params.id;

    try {
        // אנחנו מעדכנים את העמודה במקום לעשות DELETE
        await db.execute('UPDATE todos SET is_deleted = 1 WHERE id = ?', [todoId]);
        res.json({ message: "Todo deleted successfully (soft delete)" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};