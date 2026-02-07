const User = require('../../models/user');


async function handleGetAllusers(req,res) {
    const users = await User.find({});
    if(!users){
        res.status(400).json({ msg: "No user found"})
    }
    res.status(200).json({users});
}

module.exports = {
    handleGetAllusers,
}