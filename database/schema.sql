-- יצירת מסד הנתונים ובחירתו
CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

-- 1. טבלת משתמשים (Users)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT 0
);

-- 2. טבלת משימות (Todos)
CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    completed BOOLEAN DEFAULT 0,
    user_id INT NOT NULL,
    is_deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3. טבלת פוסטים (Posts)
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    user_id INT NOT NULL,
    is_deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. טבלת תגובות (Comments)
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postId INT NOT NULL,
    body TEXT NOT NULL,
    email VARCHAR(100), 
    is_deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (postId) REFERENCES posts(id)
);

-- 5. טבלת אלבומים (Albums)
CREATE TABLE IF NOT EXISTS albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- 6. טבלת תמונות (Photos)
CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    albumId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnailUrl VARCHAR(500) NOT NULL,
    is_deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (albumId) REFERENCES albums(id)
);