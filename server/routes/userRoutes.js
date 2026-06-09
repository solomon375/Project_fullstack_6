const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:id/todos', userController.getUserTodos);
router.get('/:id/posts', userController.getUserPosts);
router.get('/:id/albums', userController.getUserAlbums);

module.exports = router;