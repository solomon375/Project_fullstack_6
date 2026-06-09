const express = require('express');
const router = express.Router();
const postController = require('../controllers/postsController');

router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost); // שונה ל-PUT!
router.delete('/:id', postController.deletePost);

module.exports = router;