const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/signup', userController.postUsers);
router.post('/signin', userController.siginIn);
router.get('/token', userController.getToken);
router.delete('/signout', userController.signOut);

module.exports = router;