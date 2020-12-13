const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts.controller');

router.post('/createpost', postController.submitPosts);
router.get('/postlist', postController.getPostsList);
router.get('/post/:id', postController.getPost);
router.put('/post/:id', postController.updatePost);
router.delete('/post/:id', postController.deletePost);

module.exports = router;