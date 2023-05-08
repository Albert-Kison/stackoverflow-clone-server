const Question = require('../models/question');

const CastError = require('../errors/CastError');

const ForbiddenError = require('../errors/ForbiddenError');

const NotFoundError = require('../errors/NotFoundError');

const ValidationError = require('../errors/ValidationError');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const createQuestion = (req, res, next) => {
  const {link,text} = req.body;
  Question.create({link,text, owner: req.user._id })
    .then((question) => res.status(200).send(question))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Wrond data transferred'));
      }
      next(err);
    });
};
const editQuestion = (req, res, next) => {
  const { link,text } = req.body;
  const questionId = req.params.id; 
  Question.findByIdAndUpdate(
    questionId,
    { link,text },
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
  addComment

};
