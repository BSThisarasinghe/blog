const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');
const postController = require('../controllers/posts.controller');

router.post('/createpost', auth.authenticateToken, postController.submitPosts);
router.get('/mypostlist', auth.authenticateToken, postController.getMyPostsList);
router.get('/mypost/:id', auth.authenticateToken, postController.getMyPost);
router.put('/mypost/:id', auth.authenticateToken, postController.updateMyPost);
router.delete('/mypost/:id', auth.authenticateToken, postController.deleteMyPost);

router.get('/allpostlist', postController.getAllPostsList);
router.get('/post/:id', postController.getPost);

module.exports = router;