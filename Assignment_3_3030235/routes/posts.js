const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { sampleUrl } = require('../config');

const {
  createPost,
  deletePost,
  addComment,
  removeComment,
  editPost,
  editComment
} = require('../controllers/posts');


router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      link:Joi.string().pattern(sampleUrl).required(),
      text: Joi.string().min(20).max(1000),
    }),
  }),
  createPost,
);
router.post(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      link: Joi.string().pattern(sampleUrl).required(),
      text: Joi.string().min(20).max(1000),
    }),
  }),
  editPost,
);
router.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().required().length(24).hex(),
    }),
  }),
  deletePost,
);
router.put(
  '/comments/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().required().length(24).hex(),
    }),
  }),
  addComment
);
router.patch(
  '/:postId/comments/:commentId',
  celebrate({
    params: Joi.object().keys({
      postId: Joi.string().required().length(24).hex(),
      commentId: Joi.string().required().length(24).hex(),
    }),
  }),
  editComment
);

router.delete(
  '/:postId/comments/:commentId',
  celebrate({
    params: Joi.object().keys({
      postId: Joi.string().required().length(24).hex(),
      commentId: Joi.string().required().length(24).hex(),
    }),
  }),
  removeComment,
);

module.exports = router;
