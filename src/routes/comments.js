const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');
const commentController = require('../controllers/comments.controller');

router.post('/createcomment', auth.authenticateToken, commentController.submitComments);

module.exports = router;