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

// const postUser = (req, res, next) => {
//   const {name, email, password} = req.body;
//   User.findOne({ email })
//     .then((user) => {
//       if (user) {
//         throw new ConflictError('User with this email is already registered!');
//       }
//       return bcrypt.hash(password, SALT_ROUND);
//     })
//     .then((hash) => User.create({
//       name: req.body.name,
//       email: req.body.email,
//       password: hash,
//     }))
//     .then(() => res.status(201).send({ message: `user account ${email} was created!` }))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new ValidationError('Wrong data!'));
//       }
//       next(err);
//     });
// };
const postUser = (req, res, next) => {
  const { name, email, password, tags } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('User with this email is already registered!');
      }
      return bcrypt.hash(password, SALT_ROUND);
    })
    .then((hash) => {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
        tags: req.body.tags || [],
        isExpert: req.body.tags && req.body.tags.length > 0,
      };
      return User.create(newUser);
    })
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        tags: user.tags,
        isExpert: user.isExpert,
      });
    })
    .catch(next);
};
// const deleteUser = (req, res, next) => {
//   User.findByIdAndDelete(req.params.userId)
//     .then((user) => {
//       if (!user) {
//         return res.status(404).send({ message: 'User not found' });
//       }
//       res.status(200).send({ message: 'User deleted successfully' });
//     })
//     .catch(next);
// };
// const deleteUser = async (req, res, next) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Only allow admin or the user himself to delete the user
//     if (!req.user.isAdmin && req.user._id.toString() !== user._id.toString()) {
//       return res.status(403).json({ error: "Forbidden" });
//     }

//     await User.findByIdAndDelete(userId);

//     res.status(200).send({ message: 'User deleted successfully' });
//   } catch (err) {
//     if (err.name === 'CastError') {
//       return next(new BadRequestError('Invalid user ID'));
//     }

//     next(err);
//   }
// };
const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only allow admin or the user himself to delete the user
    if (!req.user.isAdmin && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Delete user's question(s)
    await Question.deleteMany({ owner: user._id });

    // Delete user's answer(s), if any
    const questions = await Question.find({ "answers.ownerName": user._id });
    for (const question of questions) {
      question.answers = question.answers.filter((answer) => answer.ownerName.toString() !== user._id.toString());
      await question.save();
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).send({ message: 'User deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid user ID'));
    }

    next(err);
  }
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
// const editUser = (req, res, next) => {
//   const { userId } = req.params;
//   const { name, email, isAdmin } = req.body;

//   User.findByIdAndUpdate(userId, { name, email, isAdmin })
//     .then((user) => {
//       if (!user) {
//         res.status(404).send({ message: 'User not found' });
//       } else {
//         res.status(200).send(user);
//       }
//     })
//     .catch(next);
// };
const editUser = async (req, res, next) => {
  const { userId } = req.params;
  const { name, email, password, tags } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only allow admin or the user himself to edit the user's data
    if (!req.user.isAdmin && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Update the user's data
    user.name = name;
    user.email = email;
    user.tags = tags || [];
    user.isExpert = tags && tags.length > 0;

    if (password) {
      user.password = await bcrypt.hash(password, SALT_ROUND);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      tags: updatedUser.tags,
      isExpert: updatedUser.isExpert,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid user ID'));
    } else if (err.name === 'ValidationError') {
      return next(new ValidationError('Invalid user data'));
    }

    next(err);
  }
};

// const login = (req, res, next) => {
//   const { email, password } = req.body;
//   User.findOne({ email })
//     .orFail(() => {
//       throw new AuthError('Wrong name or password!');
//     });

//   return User.findUserByCredentials(email, password)
//     .then((user) => {
    //   if(user.email=="aivanzhukov28@gmail.com"){
    //     user.isAdmin =true;
    //     user.save();
    //   }
    //   const token = jwt.sign(
    //     { _id: user._id },
    //     JWT_SECRET,
    //     { expiresIn: '7d' },
    //   );
    //   res.send({ token, id: user._id,isAdmin: user.isAdmin,name:user.name });
    // })
//     .catch(next);
// };
// const login = (req, res, next) => {
//   const { email, password } = req.body;
//   User.findOne({ email })
//     .orFail(() => {
//       throw new AuthError('Wrong name or password!');
//     })
//     .then((user) => {
//       if(user.email=="aivanzhukov28@gmail.com"){
//         user.isAdmin =true;
//         user.save();
//       }
//       const token = jwt.sign(
//         { _id: user._id },
//         JWT_SECRET,
//         { expiresIn: '7d' },
//       );
//       res.send({ token, id: user._id,isAdmin: user.isAdmin,name:user.name });
//     })
//     .catch(next);
// };
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new AuthError('Wrong email or password!');
    })
    .then((user) => {
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new AuthError('Wrong email or password!');
          }
          if(user.email == "aivanzhukov28@gmail.com"){
            user.isAdmin = true;
            return user.save();
          }
          return user;
        });
    })
    .then((user) => {
      // const token = jwt.sign(
      //   { _id: user._id },
      //   JWT_SECRET,
      //   { expiresIn: '7d' },
      // );
      const token = jwt.sign(
        { _id: user._id, name: user.name, tags: user.tags, isExpert: user.isExpert,isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token, id: user._id, isAdmin: user.isAdmin, name: user.name,isExpert:user.isExpert,tags: user.tags, });
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
