const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { sampleUrl } = require('../config');

const {
  getUsers,
  getUser,
  getCurrentUser,
  deleteUser,
  editUser
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }),
  getUser,
);
router.delete(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteUser,
);
router.post(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      isAdmin: Joi.boolean().required()
    }),
  }),
  editUser
);


module.exports = router;
