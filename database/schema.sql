CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

-- טבלת משתמשים (כולל סיסמאות)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- תשמור כאן סיסמה מוצפנת!
    is_deleted BOOLEAN DEFAULT 0
);

-- טבלת משימות
CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    completed BOOLEAN DEFAULT 0,
    user_id INT NOT NULL,
    is_deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
