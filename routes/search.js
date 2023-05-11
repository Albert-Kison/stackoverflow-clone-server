const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { sampleUrl } = require('../config');

const {
    getQuestion,
    searchQuestionByText,
    searchQuestionByTags
  
  } = require('../controllers/questions');

  router.get(
    '/:id',
    celebrate({
      params: Joi.object().keys({
        id: Joi.string().required(),
      }),
    }),
    getQuestion
  );
  
  router.post(
    '/text',
    celebrate({
      body: Joi.object().keys({
        text: Joi.string().min(1).max(1000).required(),
      }),
    }),
    searchQuestionByText
  );
  
  router.post(
    '/tags',
    celebrate({
      body: Joi.object().keys({
        tags: Joi.array().items(Joi.string().required()).min(1).required(),
      }),
    }),
    searchQuestionByTags
  );
  module.exports = router;