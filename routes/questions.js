const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads')); // Specify the absolute path to store the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename for the uploaded file
  }
});
const upload = multer({ storage: storage });


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
  addComment,
  // getQuestion,
  // searchQuestionByText,
  // searchQuestionByTags

} = require('../controllers/questions');


router.post(
  '/',
  // upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      // link:Joi.string().pattern(sampleUrl).required(),
      questionName: Joi.string().min(1).max(100).required(),
      text: Joi.string().min(1).max(1000),
      tags: Joi.array().items(Joi.string()),
      link:Joi.string()
    }),
  }),
  createQuestion,
);
// router.get(
//   '/:id',
//   celebrate({
//     params: Joi.object().keys({
//       id: Joi.string().required(),
//     }),
//   }),
//   getQuestion
// );

// router.post(
//   '/text',
//   celebrate({
//     body: Joi.object().keys({
//       text: Joi.string().min(1).max(1000).required(),
//     }),
//   }),
//   searchQuestionByText
// );

// router.post(
//   '/tags',
//   celebrate({
//     body: Joi.object().keys({
//       tags: Joi.array().items(Joi.string().required()).min(1).required(),
//     }),
//   }),
//   searchQuestionByTags
// );
router.post(
  '/:id',
  // upload.single('image'),
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      // link: Joi.string().pattern(sampleUrl).required(),
      questionName: Joi.string().min(1).max(100).required(),
      text: Joi.string().min(20).max(1000),
      tags: Joi.array().items(Joi.string()),
      link:Joi.string()
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