const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// --- ראוט מנהל (שליפת כל המשתמשים) ---
// שמנו אותו למעלה כדי לשמור על סדר לוגי של הכתובות
router.get('/', userController.getAllUsers);

// --- הראוטים הקיימים שלך ---
router.get('/:id/todos', userController.getUserTodos);
router.get('/:id/posts', userController.getUserPosts);
router.get('/:id/albums', userController.getUserAlbums);

// --- ראוטים חדשים לעדכון וחסימה ---
// עדכון פרטי משתמש (הגדרות חשבון)
router.put('/:id', userController.updateUser);

// חסימה או שחרור משתמש (מנהל)
router.put('/:id/block', userController.toggleBlockUser);

module.exports = router;