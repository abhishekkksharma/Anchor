const express = require('express');
const { handleUserSignup,handleUserLogin,handleUserData } = require('../controllers/user/user');
const { handleCreatePost,handleGetAllPosts } = require('../controllers/post/post');
const  authMiddleware = require('../mildewares/authMiddleware');


const router = express.Router();

router.post('/signup',handleUserSignup);
router.post('/login',handleUserLogin);
router.get('/userData',authMiddleware, handleUserData);
router.post('/post/create',authMiddleware, handleCreatePost);
router.get('/post/allPosts',authMiddleware, handleGetAllPosts);

module.exports = router;