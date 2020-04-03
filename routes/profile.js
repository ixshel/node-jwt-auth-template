const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require("../models/User");

/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /profile/me
 */

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        res.send({ message: 'Error fetching user' });
    }
});

module.exports = router;