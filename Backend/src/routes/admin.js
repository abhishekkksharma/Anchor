const express = require('express');
const {handleGetAllusers,handleGetContactInfo} = require('../controllers/admin/admin')

const router = express.Router();

router.get('/allusers',handleGetAllusers);
router.get('/contactFroms',handleGetContactInfo);

module.exports = router;