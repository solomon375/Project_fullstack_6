const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

router.post('/', photoController.createPhoto);
router.put('/:id', photoController.updatePhoto); // שונה ל-PUT!
router.delete('/:id', photoController.deletePhoto);

module.exports = router;