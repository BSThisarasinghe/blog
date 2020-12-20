const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');
const postController = require('../controllers/posts.controller');

router.post('/createpost', auth.authenticateToken, postController.submitPosts);
router.get('/postlist', auth.authenticateToken, postController.getPostsList);
router.get('/post/:id', auth.authenticateToken, postController.getPost);
router.put('/post/:id', auth.authenticateToken, postController.updatePost);
router.delete('/post/:id', auth.authenticateToken, postController.deletePost);

module.exports = router;