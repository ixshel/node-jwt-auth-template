const jwt = require('jsonwebtoken');

module.exports = ((req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized user' });

    try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded.user;
        next();
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Invalid Token' });
    }
})