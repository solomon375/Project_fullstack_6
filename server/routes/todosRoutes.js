const express = require('express');
const router = express.Router();
const todosController = require('../controllers/todosController');

router.get('/', todosController.getAllTodos); // שליפה
router.post('/', todosController.createTodo); // יצירה
router.put('/:id', todosController.updateTodo); // עדכון
router.delete('/:id', todosController.deleteTodo); // מחיקה רכה

module.exports = router;