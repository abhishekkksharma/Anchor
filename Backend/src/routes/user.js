const express = require('express');
const { handleUserSignup, handleUserLogin, handleUserData, handleCreateContact } = require('../controllers/user/user');
const { handleCreatePost, handleGetAllPosts, handleDeletePost, handleLikePost } = require('../controllers/post/post');
const authMiddleware = require('../mildewares/authMiddleware');


const router = express.Router();

router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
router.get('/userData', authMiddleware, handleUserData);

router.post('/post/create', authMiddleware, handleCreatePost);
router.get('/post/allPosts', authMiddleware, handleGetAllPosts);
router.post('/post/like/:id', authMiddleware, handleLikePost);
router.delete('/post/:id', handleDeletePost);

router.post('/contact/contactForm', handleCreateContact);


module.exports = router;