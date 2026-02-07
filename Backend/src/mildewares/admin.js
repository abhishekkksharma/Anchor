const User = require('../models/user');

async function isUserAdmin(req,res,next) {
    // Todo: check for role
    const user = req.User;
    next();
}