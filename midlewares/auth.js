const jwt = require('jsonwebtoken');

const AuthError = require('../errors/AuthError');

const { JWT_SECRET } = require('../config');

const auth = (req, res, next) => {
  console.log("in auth");
  const { authorization } = req.headers;
  let token;
  if (!authorization) {
    next(new AuthError('Authorization required!'));
  } else if (authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '');
  } else {
    token = authorization;
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      _id: payload._id,
      name: payload.name,
      tags: payload.tags,
      isExpert: payload.isExpert,
      isAdmin: payload.isAdmin
    };
  } catch (err) {
    next(new AuthError('Authorization required!'));
  }
  // req.user = payload;

  console.log("next middleware");
  next();
};
module.exports = { auth };
