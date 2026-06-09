const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment); // שונה ל-PUT!
router.delete('/:id', commentController.deleteComment);

module.exports = router;