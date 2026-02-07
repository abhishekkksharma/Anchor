const express = require('express');
const {handleGetAllusers} = require('../controllers/admin/admin')

const router = express.Router();

router.get('/allusers',handleGetAllusers);

module.exports = router;