const express = require('express');
const { addUserController } = require('../controllers/addUserController');

const router = express.Router();

router.post('/addUser', addUserController);

module.exports = router;