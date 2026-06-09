const db = require('../config/db');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // ולידציה בסיסית בצד השרת
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // מחפשים את המשתמש במסד הנתונים
        const [users] = await db.execute(
            'SELECT id, name, email FROM users WHERE email = ? AND password = ? AND is_deleted = 0',
            [email, password] // שימו לב: לא שולפים את הסיסמה חזרה ללקוח!
        );

        if (users.length === 0) {
            // לא נמצא משתמש או שהסיסמה שגויה
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // התחברות מוצלחת - שולחים את פרטי המשתמש ללקוח
        res.json({ message: "Login successful", user: users[0] });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};