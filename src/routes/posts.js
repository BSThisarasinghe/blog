const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts.controller');

router.post('/createpost', postController.submitPosts);
router.get('/postlist', postController.getPostsList);
router.get('/post/:id', postController.getPost);

module.exports = router;