const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklist.model');

const authUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized , no token provided' });
  }

  // Check if the token is blacklisted
  const blacklistedToken = await blacklistModel.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ message: 'Unauthorized , token is invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {
  authUser,
};
