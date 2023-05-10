const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { sampleUrl } = require('../config');

const {
  createQuestion,
  deleteQuestion,
  addAnswer,
  removeAnswer,
  editQuestion,
  editAnswer,
  approveAnswer,
  upvoteAnswer,
  gradeAnswer,
  addComment

} = require('../controllers/questions');


router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      link:Joi.string().pattern(sampleUrl).required(),
      text: Joi.string().min(20).max(1000),
      tags: Joi.array().items(Joi.string()),
    }),
  }),
  createQuestion,
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
      tags: Joi.array().items(Joi.string()),
    }),
  }),
  editQuestion,
);
router.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteQuestion,
);
router.put(
  '/answers/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().required().length(24).hex(),
    }),
  }),
  addAnswer
);
router.patch(
  '/:questionId/answers/:answerId',
  celebrate({
    params: Joi.object().keys({
      questionId: Joi.string().required().length(24).hex(),
      answerId: Joi.string().required().length(24).hex(),
    }),
  }),
  editAnswer
);

router.delete(
  '/:questionId/answers/:answerId',
  celebrate({
    params: Joi.object().keys({
      questionId: Joi.string().required().length(24).hex(),
      answerId: Joi.string().required().length(24).hex(),
    }),
  }),
  removeAnswer,
);
router.post(
  '/:questionId/answers/:answerId/comments',
  celebrate({
    params: Joi.object().keys({
      questionId: Joi.string().required().length(24).hex(),
      answerId: Joi.string().required().length(24).hex(),
    }),
    body: Joi.object().keys({
      text: Joi.string().min(1).max(1000).required(),
    }),
  }),
  addComment,
);

router.patch(
  '/:questionId/answers/:answerId/approve',
  celebrate({
    params: Joi.object().keys({
      questionId: Joi.string().required().length(24).hex(),
      answerId: Joi.string().required().length(24).hex(),
    }),
  }),
  approveAnswer,
);

router.patch(
  '/:questionId/answers/:answerId/upvote',
  celebrate({
    params: Joi.object().keys({
      questionId: Joi.string().required().length(24).hex(),
      answerId: Joi.string().required().length(24).hex(),
    }),
  }),
  upvoteAnswer,
);

router.patch(
  '/:questionId/answers/:answerId/grade',
  celebrate({
    params: Joi.object().keys({
      questionId: Joi.string().required().length(24).hex(),
      answerId: Joi.string().required().length(24).hex(),
    }),
    body: Joi.object().keys({
      grade: Joi.number().integer().min(0).max(10).required(),
    }),
  }),
  gradeAnswer,
);

module.exports = router;