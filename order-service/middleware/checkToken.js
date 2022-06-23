const { verifyToken } = require('../utils/jwt');

const {
    env: { TOKEN_SECRET_KEY },
} = process;


module.exports = async (req, res, next) => {
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ) {
        return res.status(401).send({
            msg: 'Please provide the token'
        })
    };
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await verifyToken(token, TOKEN_SECRET_KEY);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid Token' });
    }
};