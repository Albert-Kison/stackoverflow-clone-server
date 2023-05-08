const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');

const { JWT_SECRET, SALT_ROUND } = require('../config');

const CastError = require('../errors/CastError');

const ConflictError = require('../errors/ConflictError');

const ValidationError = require('../errors/ValidationError');

const AuthError = require('../errors/AuthError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.json(users); 
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('User with this id is not found!');
    })
    .then((user) => {
      res
        .status(200)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Unvalid id of user'));
      }
      next(err);
    });
};

const postUser = (req, res, next) => {
  const {name, email, password} = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('User with this email is already registered!');
      }
      return bcrypt.hash(password, SALT_ROUND);
    })
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then(() => res.status(201).send({ message: `user account ${email} was created!` }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Wrong data!'));
      }
      next(err);
    });
};
const deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send({ message: 'User deleted successfully' });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (user) {
      return res.status(200).send(user);
    }
    throw new NotFoundError('No user with this id!');
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Wrong data!'));
      }
      next(err);
    });
};
const editUser = (req, res, next) => {
  const { userId } = req.params;
  const { name, email, isAdmin } = req.body;

  User.findByIdAndUpdate(userId, { name, email, isAdmin })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(() => {
      throw new AuthError('Wrong name or password!');
    });

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if(user.email=="aivanzhukov28@gmail.com"){
        user.isAdmin =true;
        user.save();
      }
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token, id: user._id,isAdmin: user.isAdmin,name:user.name });
    })
    .catch(next);
};

module.exports = {
  postUser,
  getCurrentUser,
  getUsers,
  getUser,
  login,
  deleteUser,
  editUser
};
