const db = require('../config/db');

// פונקציית הרשמה (Register) - מעודכנת ומאובטחת
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // ולידציה בסיסית
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }

    try {
        // 👇 תיקון באג ייחודיות: בודקים אם האימייל קיים בכלל בטבלה (גם אם נמחק/נחסם)
        const [existingUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: "Email already exists in the system" });
        }

        // מכניסים את המשתמש החדש לטבלה
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );

        // מחזירים ללקוח הודעת הצלחה ואת פרטי המשתמש (בלי הסיסמה!)
        res.status(201).json({
            message: "User registered successfully",
            user: { id: result.insertId, name, email, is_admin: 0 }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// פונקציית התחברות (Login) - כולל מנגנון הגנה מחסימות
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // שליפת המשתמש ממסד הנתונים
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = users[0];

        // 👇 שומר הסף החדש! אם המנהל חסם אותו, הוא לא יכול להיכנס בכלל 👇
        if (user.is_deleted === 1) {
            return res.status(403).json({ error: "This account has been blocked by an admin." });
        }

        // בדיקת סיסמה (בהנחה שאין לך עדיין הצפנה)
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // מוודאים שכל הנתונים, כולל הניהול, חוזרים ל-React
        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin 
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};