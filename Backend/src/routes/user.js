const express = require('express');
const { handleUserSignup,handleUserLogin,handleUserData } = require('../controllers/user/user');
const  authMiddleware = require('../mildewares/authMiddleware');


const router = express.Router();

router.post('/signup',handleUserSignup);
router.post('/login',handleUserLogin);
router.get('/userData',authMiddleware, handleUserData);

module.exports = router;