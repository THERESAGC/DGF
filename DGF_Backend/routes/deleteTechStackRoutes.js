const express = require('express');
const router = express.Router();
const techStackController = require('../controllers/deleteTechStackController');
 
router.delete('/:stackId', techStackController.deleteTechStack);
 
module.exports = router;