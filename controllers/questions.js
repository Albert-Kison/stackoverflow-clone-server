const Question = require('../models/question');
const User = require('../models/user');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const CastError = require('../errors/CastError');

const ForbiddenError = require('../errors/ForbiddenError');

const NotFoundError = require('../errors/NotFoundError');

const ValidationError = require('../errors/ValidationError');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


// const createQuestion = (req, res, next) => {
//   const {link,text} = req.body;
//   Question.create({link,text, owner: req.user._id })
//     .then((question) => res.status(200).send(question))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new ValidationError('Wrond data transferred'));
//       }
//       next(err);
//     });
// };
const getQuestion = (req, res, next) => {
  const questionId = req.params.id;

  Question.findById(questionId)
    .populate('owner', 'name email tags isExpert')
    .then((question) => {
      if (!question) {
        return res.status(404).send({ message: 'Question not found' });
      }

      res.send({
        _id: question._id,
        text: question.text,
        image: question.image,
        owner: {
          _id: question.owner._id,
          name: question.owner.name,
          email: question.owner.email,
          tags: question.owner.tags,
          isExpert: question.owner.isExpert,
        },
        tags: question.tags,
        answers: question.answers.map((answer) => ({
          _id: answer._id,
          text: answer.text,
          name: answer.name,
          user_name: answer.user_name,
          approved: answer.approved,
          grade: answer.grade,
          upvotes: answer.upvotes,
          comments: answer.comments,
          createdAt: answer.createdAt,
        })),
        answered: question.answered,
        createdAt: question.createdAt,
      });
    })
    .catch(next);
};

const searchQuestionByText = (req, res, next) => {
  const searchText = req.query.text;

  Question.find({ text: { $regex: searchText, $options: 'i' } })
    .populate('owner', 'name email tags isExpert')
    .then((questions) => {
      res.send(questions.map((question) => ({
        _id: question._id,
        text: question.text,
        image: question.image,
        owner: {
          _id: question.owner._id,
          name: question.owner.name,
          email: question.owner.email,
          tags: question.owner.tags,
          isExpert: question.owner.isExpert,
        },
        tags: question.tags,
        answers: question.answers.map((answer) => ({
          _id: answer._id,
          text: answer.text,
          name: answer.name,
          user_name: answer.user_name,
          approved: answer.approved,
          grade: answer.grade,
          upvotes: answer.upvotes,
          comments: answer.comments,
          createdAt: answer.createdAt,
        })),
        answered: question.answered,
        createdAt: question.createdAt,
      })));
    })
    .catch(next);
};

const searchQuestionByTags = (req, res, next) => {
  const tags = req.query.tags;

  Question.find({ tags: { $all: tags } })
    .populate('owner', 'name email tags isExpert')
    .then((questions) => {
      res.send(questions.map((question) => ({
        _id: question._id,
        text: question.text,
        image: question.image,
        owner: {
          _id: question.owner._id,
          name: question.owner.name,
          email: question.owner.email,
          tags: question.owner.tags,
          isExpert: question.owner.isExpert,
        },
        tags: question.tags,
        answers: question.answers.map((answer) => ({
          _id: answer._id,
          text: answer.text,
          name: answer.name,
          user_name: answer.user_name,
          approved: answer.approved,
          grade: answer.grade,
          upvotes: answer.upvotes,
          comments: answer.comments,
          createdAt: answer.createdAt,
        })),
        answered: question.answered,
        createdAt: question.createdAt,
      })));
    })
    .catch(next);
};

// const createQuestion = (req, res, next) => {
//   const { text, image, tags } = req.body;
//   Question.create({ text, image, tags, owner: req.user._id })
//     .then((question) => res.status(200).send(question))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new ValidationError('Wrong data transferred'));
//       }
//       next(err);
//     });
// };
// const editQuestion = (req, res, next) => {
//   const { image,text,tags} = req.body;
//   const questionId = req.params.id; 
//   Question.findByIdAndUpdate(
//     questionId,
//     { image,text,tags},
//     { new: true }
//   )
//     .then((question) => {
//       if (!question) {
//         throw new NotFoundError('Question not found');
//       }
//       res.status(200).send(question);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Invalid question ID'));
//       } else if (err.name === 'ValidationError') {
//         next(new ValidationError('Invalid question data'));
//       } else {
//         next(err);
//       }
//     });
// };
// const createQuestion = (req, res, next) => {
//   upload.single('image')(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return next(new Error('Error uploading image.'));
//     } else if (err) {
//       return next(err);
//     }
  
//     const { text, tags } = req.body;
//     const image = req.file.buffer;
  
//     Question.create({ text, image, tags, owner: req.user._id })
//       .then((question) => res.status(200).send(question))
//       .catch((err) => {
//         if (err.name === 'ValidationError') {
//           next(new ValidationError('Wrong data transferred'));
//         }
//         next(err);
//       });
//   });
// };
const createQuestion = (req, res, next) => {
  const { text, tags } = req.body;
  const image = req.file ? req.file.buffer : 'default-image.jpg';

  Question.create({ text, image, tags, owner: req.user._id })
    .then((question) => res.status(200).send(question))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Wrong data transferred'));
      }
      next(err);
    });
};

const editQuestion = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(new Error('Error uploading image.'));
    } else if (err) {
      return next(err);
    }
  
    const { text, tags } = req.body;
    const image = req.file ? req.file.buffer : 'default-image.jpg';
  
    Question.findByIdAndUpdate(
      req.params.id,
      { text, tags, ...(image && { image }) },
      { new: true }
    )
      .then((question) => {
        if (!question) {
          throw new NotFoundError('Question not found');
        }
        res.status(200).send(question);
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new BadRequestError('Invalid question ID'));
        } else if (err.name === 'ValidationError') {
          next(new ValidationError('Invalid question data'));
        } else {
          next(err);
        }
      });
  });
};
const deleteQuestion = (req, res, next) => {
  Question.findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError('No Question with this id!');
    })
    .then((question) => {
      Question.findByIdAndRemove(req.params._id)
          .then((data) => res
            .status(200)
            .send({ data, message: 'Question was deleted!' }))
          .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Unvalid id of post'));
      }
      next(err);
    });
};

const addAnswer = (req, res, next) => {
  const { text, name } = req.body;

  if (!text || !name) {
    return res.status(400).send({ message: 'Text and name are required' });
  }

  const questionId = req.params._id;
  const answerId = new ObjectId();

  Question.findByIdAndUpdate(
    questionId,
    { $push: { answers: { _id: answerId,text, name, user_name: req.user.name } } },
    { new: true }
  )
    .then((updatedQuestion) => {
      res.status(200).send(updatedQuestion);
    })
    .catch((err) => {
      next(err);
    });
};
const editAnswer = (req, res, next) => {
  const questionId = req.params.questionId;
  const answerId = req.params.answerId;
  const updatedAnswer = req.body;

  Question.findOneAndUpdate(
    { _id: questionId, "answers._id": answerId },
    { $set: { "answers.$": updatedAnswer } },
    { new: true }
  )
    .then((updatedQuestion) => {
      if (!updatedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(200).json(updatedQuestion);
    })
    .catch((err) => {
      next(err);
    });
};

const removeAnswer = (req, res, next) => {
  const questionId = req.params.questionId;
  const answerId = req.params.answerId;

  Question.findByIdAndUpdate(
    questionId,
    { $pull: { answers: { _id: answerId } } },
    { new: true }
  )
    .then((updatedQuestion) => {
      if (!updatedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(200).json(updatedQuestion);
    })
    .catch((err) => {
      next(err);
    });
};
const approveAnswer = (req, res, next) => {
  const questionId = req.params.questionId;
  const answerId = req.params.answerId;

  Question.findOneAndUpdate(
    { _id: questionId, "answers._id": answerId },
    { $set: { "answers.$.approved": true }, answered: true },
    { new: true }
  )
    .then((updatedQuestion) => {
      if (!updatedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(200).json(updatedQuestion);
    })
    .catch((err) => {
      next(err);
    });
};
const gradeAnswer = (req, res, next) => {
  const { grade } = req.body;
  const questionId = req.params.questionId;
  const answerId = req.params.answerId;
  
  Question.findOneAndUpdate(
    { _id: questionId, "answers._id": answerId },
    { $set: { "answers.$.grade": grade } },
    { new: true }
  )
    .then((updatedQuestion) => {
      if (!updatedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(200).json(updatedQuestion);
    })
    .catch((err) => {
      next(err);
    });
};
const upvoteAnswer = (req, res, next) => {
  const questionId = req.params.questionId;
  const answerId = req.params.answerId;
  Question.findOneAndUpdate(
    { _id: questionId, "answers._id": answerId },
    { $inc: { "answers.$.upvotes": 1 } },
    { new: true }
  )
    .then((updatedQuestion) => {
      if (!updatedQuestion) {
        return res.status(404).json({ error: "Question not found Upvote" });
      }
      res.status(200).json(updatedQuestion);
    })
    .catch((err) => {
      next(err);
    });
};
const addComment = (req, res, next) => {
  const { text } = req.body;
  const questionId = req.params.questionId;
  const answerId = req.params.answerId;

  if (!text) {
    return res.status(400).send({ message: 'Text is required' });
  }

  Question.findOneAndUpdate(
    { _id: questionId, "answers._id": answerId },
    { $push: { "answers.$.comments": { text, user: req.user._id } } },
    { new: true }
  )
    .then((updatedQuestion) => {
      if (!updatedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(200).json(updatedQuestion);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
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
  getQuestion,
  searchQuestionByText,
  searchQuestionByTags

};
