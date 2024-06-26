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
// const getQuestion = (req, res, next) => {
//   const questionId = req.params.id;

//   Question.findById(questionId)
//     .populate('owner', 'name email tags isExpert')
//     .then((question) => {
//       if (!question) {
//         return res.status(404).send({ message: 'Question not found' });
//       }

//       res.send({
//         _id: question._id,
//         text: question.text,
//         image: question.image,
//         owner: {
//           _id: question.owner._id,
//           name: question.owner.name,
//           email: question.owner.email,
//           tags: question.owner.tags,
//           isExpert: question.owner.isExpert,
//         },
//         tags: question.tags,
//         answers: question.answers.map((answer) => ({
//           _id: answer._id,
//           text: answer.text,
//           name: answer.name,
//           user_name: answer.user_name,
//           approved: answer.approved,
//           grade: answer.grade,
//           upvotes: answer.upvotes,
//           comments: answer.comments,
//           createdAt: answer.createdAt,
//         })),
//         answered: question.answered,
//         createdAt: question.createdAt,
//       });
//     })
//     .catch(next);
// };
const getQuestion = (req, res, next) => {
  const questionId = req.params.id;

  Question.findById(questionId)
    .populate('owner', 'name email tags isExpert')
    .populate('answers.ownerName', 'name tags') // add this line to populate the ownerName field with the user's name
    .populate('answers.comments.user', 'name') // add this line to populate the user field with the user's name
    .then((question) => {
      if (!question) {
        return res.status(404).send({ message: 'Question not found' });
      }

      res.send({
        _id: question._id,
        questionName: question.questionName,
        text: question.text,
        link: question.link,
        owner: {
          _id: question.owner._id,
          name: question.owner.name,
          email: question.owner.email,
          tags: question.owner.tags,
          isExpert: question.owner.isExpert,
        },
        // ownerName: question.owner.name,
        tags: question.tags,
        answers: question.answers.map((answer) => ({
          _id: answer._id,
          text: answer.text,
          link:answer.link,
          name: answer.name,
          ownerName: answer.ownerName,
          user_name: answer.user_name,
          approved: answer.approved,
          grade: answer.grade,
          upvotes: answer.upvotes,
          comments: answer.comments,
          createdAt: answer.createdAt,
          user: answer.user,
          userName: answer.user ? answer.user.name : null,
        })),
        answered: question.answered,
        createdAt: question.createdAt,
      });
    })
    .catch(next);
};
// const searchQuestionByText = (req, res, next) => {
//   const searchText = req.body.text;

//   Question.find({ text: { $regex: searchText, $options: 'i' } })
//     .populate('owner', 'name email tags isExpert')
//     .then((questions) => {
//       res.send(questions.map((question) => ({
//         _id: question._id,
//         text: question.text,
//         image: question.image,
//         owner: {
//           _id: question.owner._id,
//           name: question.owner.name,
//           email: question.owner.email,
//           tags: question.owner.tags,
//           isExpert: question.owner.isExpert,
//         },
//         tags: question.tags,
//         answers: question.answers.map((answer) => ({
//           _id: answer._id,
//           text: answer.text,
//           name: answer.name,
//           user_name: answer.user_name,
//           approved: answer.approved,
//           grade: answer.grade,
//           upvotes: answer.upvotes,
//           comments: answer.comments,
//           createdAt: answer.createdAt,
//         })),
//         answered: question.answered,
//         createdAt: question.createdAt,
//       })));
//     })
//     .catch(next);
// };

// const searchQuestionByTags = (req, res, next) => {
//   const tags = req.body.tags;

//   Question.find({ tags: { $all: tags } })
//     .populate('owner', 'name email tags isExpert')
//     .then((questions) => {
//       res.send(questions.map((question) => ({
//         _id: question._id,
//         text: question.text,
//         image: question.image,
//         owner: {
//           _id: question.owner._id,
//           name: question.owner.name,
//           email: question.owner.email,
//           tags: question.owner.tags,
//           isExpert: question.owner.isExpert,
//         },
//         tags: question.tags,
//         answers: question.answers.map((answer) => ({
//           _id: answer._id,
//           text: answer.text,
//           name: answer.name,
//           user_name: answer.user_name,
//           approved: answer.approved,
//           grade: answer.grade,
//           upvotes: answer.upvotes,
//           comments: answer.comments,
//           createdAt: answer.createdAt,
//         })),
//         answered: question.answered,
//         createdAt: question.createdAt,
//       })));
//     })
//     .catch(next);
// };
const searchQuestionByText = (req, res, next) => {
  const searchText = req.body.text;

  Question.find({ text: { $regex: searchText, $options: 'i' } })
    .populate('owner', 'name email tags isExpert')
    .populate('answers.ownerName', 'name tags') // add this line to populate the ownerName field with the user's name
    .populate('answers.comments.user', 'name') // add this line to populate the user field with the user's name
    .then((questions) => {
      res.send(questions.map((question) => ({
        _id: question._id,
        questionName: question.questionName,
        text: question.text,
        link: question.link,
        owner: {
          _id: question.owner._id,
          name: question.owner.name,
          email: question.owner.email,
          tags: question.owner.tags,
          isExpert: question.owner.isExpert,
        },
        // ownerName: question.owner.name,
        tags: question.tags,
        answers: question.answers.map((answer) => ({
          _id: answer._id,
          text: answer.text,
          link:answer.link,
          name: answer.name,
          ownerName: answer.ownerName,
          user_name: answer.user_name,
          approved: answer.approved,
          grade: answer.grade,
          upvotes: answer.upvotes,
          comments: answer.comments,
          createdAt: answer.createdAt,
          user: answer.user,
          userName: answer.user ? answer.user.name : null,
        })),
        answered: question.answered,
        createdAt: question.createdAt,
      })));
    })
    .catch(next);
};

const searchQuestionByTags = (req, res, next) => {
  const tags = req.body.tags;

  Question.find({ tags: { $all: tags } })
    .populate('owner', 'name email tags isExpert')
    .populate('answers.ownerName', 'name tags') // add this line to populate the ownerName field with the user's name
    .populate('answers.comments.user', 'name') // add this line to populate the user field with the user's name
    .then((questions) => {
      res.send(questions.map((question) => ({
        _id: question._id,
        questionName: question.questionName,
        text: question.text,
        link: question.link,
        owner: {
          _id: question.owner._id,
          name: question.owner.name,
          email: question.owner.email,
          tags: question.owner.tags,
          isExpert: question.owner.isExpert,
        },
        // ownerName: question.owner.name,
        tags: question.tags,
        answers: question.answers.map((answer) => ({
          _id: answer._id,
          text: answer.text,
          link:answer.link,
          name: answer.name,
          ownerName: answer.ownerName,
          user_name: answer.user_name,
          approved: answer.approved,
          grade: answer.grade,
          upvotes: answer.upvotes,
          comments: answer.comments,
          createdAt: answer.createdAt,
          user: answer.user,
          userName: answer.user ? answer.user.name : null,
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
  const { link,text, tags,questionName} = req.body;
  //const image = req.file ? req.file.buffer : null;
  Question.create({ link,questionName,text, tags, owner: req.user._id })
    .then((question) => {
      Question.populate(question, { path: 'owner', select: 'name' }, (err, populatedQuestion) => {
        if (err) {
          return next(err);
        }
        res.status(200).send(populatedQuestion);
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Wrong data transferred'));
      }
      next(err);
    });
};

// const editQuestion = (req, res, next) => {
//   upload.single('image')(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return next(new Error('Error uploading image.'));
//     } else if (err) {
//       return next(err);
//     }
  
//     const { text, tags } = req.body;
//     const image = req.file ? req.file.buffer : 'default-image.jpg';
  
//     Question.findByIdAndUpdate(
//       req.params.id,
//       { text, tags, ...(image && { image }) },
//       { new: true }
//     )
//       .then((question) => {
//         if (!question) {
//           throw new NotFoundError('Question not found');
//         }
//         res.status(200).send(question);
//       })
//       .catch((err) => {
//         if (err.name === 'CastError') {
//           next(new BadRequestError('Invalid question ID'));
//         } else if (err.name === 'ValidationError') {
//           next(new ValidationError('Invalid question data'));
//         } else {
//           next(err);
//         }
//       });
//   });
// };
// const editQuestion = (req, res, next) => {
//   // upload.single('image')(req, res, (err) => {
//   //   if (err instanceof multer.MulterError) {
//   //     return next(new Error('Error uploading image.'));
//   //   } else if (err) {
//   //     return next(err);
//   //   }
  
//     const {link,questionName,text, tags } = req.body;
//     // const image = req.file ? req.file.buffer : 'default-image.jpg';
  
//     Question.findByIdAndUpdate(
//       req.params.id,
//       // {questionName,text, tags, ...(image && { image }), owner: req.user._id },
//       {questionName,text, tags,link },
//       { new: true }
//     )
//       .populate('owner', 'name')
//       .then((question) => {
//         if (!question) {
//           throw new NotFoundError('Question not found');
//         }
//         res.status(200).send(question);
//       })
//       .catch((err) => {
//         if (err.name === 'CastError') {
//           next(new BadRequestError('Invalid question ID'));
//         } else if (err.name === 'ValidationError') {
//           next(new ValidationError('Invalid question data'));
//         } else {
//           next(err);
//         }
//       });
// };
const editQuestion = async (req, res, next) => {
  try {
    const { link, questionName, text, tags } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (!req.user.isAdmin &&req.user._id.toString() !== question.owner.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { questionName, text, tags, link },
      { new: true }
    ).populate('owner', 'name');

    res.status(200).send(updatedQuestion);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid question ID'));
    } else if (err.name === 'ValidationError') {
      return next(new ValidationError('Invalid question data'));
    }

    next(err);
  }
};
// const deleteQuestion = (req, res, next) => {
//   Question.findById(req.params._id)
//     .orFail(() => {
//       throw new NotFoundError('No Question with this id!');
//     })
//     .then((question) => {
//       Question.findByIdAndRemove(req.params._id)
//           .then((data) => res
//             .status(200)
//             .send({ data, message: 'Question was deleted!' }))
//           .catch(next);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new CastError('Unvalid id of post'));
//       }
//       next(err);
//     });
// };
const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params._id).orFail(() => {
      throw new NotFoundError('No Question with this id!');
    });

    if (!req.user.isAdmin &&req.user._id.toString() !== question.owner.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const deletedQuestion = await Question.findByIdAndRemove(req.params._id);
    res.status(200).json({ data: deletedQuestion, message: 'Question was deleted!' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new CastError('Invalid id of post'));
    } else {
      next(err);
    }
  }
};

// const addAnswer = (req, res, next) => {
//   const { text, name } = req.body;

//   if (!text || !name) {
//     return res.status(400).send({ message: 'Text and name are required' });
//   }

//   const questionId = req.params._id;
//   const answerId = new ObjectId();

//   Question.findByIdAndUpdate(
//     questionId,
//     { $push: { answers: { _id: answerId,text, name, user_name: req.user.name } } },
//     { new: true }
//   )
//     .then((updatedQuestion) => {
//       res.status(200).send(updatedQuestion);
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
const addAnswer = (req, res, next) => {
  if (!req.user.isExpert) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  const {link,text } = req.body;

  if (!text) {
    return res.status(400).send({ message: 'Text is required' });
  }

  const questionId = req.params._id;
  const answerId = new ObjectId();

  Question.findByIdAndUpdate(
    questionId,
    { $push: { answers: { _id: answerId, text,link, ownerName: req.user._id } } },
    // { $push: { answers: { _id: answerId, text,link } } },
    { new: true }
  )
    .populate('answers.ownerName', 'name tags') // add this line to populate the ownerName field with the user's name
    .then((updatedQuestion) => {
      res.status(200).send(updatedQuestion);
    })
    .catch((err) => {
      next(err);
    });
};
// const editAnswer = (req, res, next) => {
//   const questionId = req.params.questionId;
//   const answerId = req.params.answerId;
//   const updatedAnswer = req.body;

//   Question.findOneAndUpdate(
//     { _id: questionId, "answers._id": answerId },
//     { $set: { "answers.$": updatedAnswer } },
//     { new: true }
//   )
//     .then((updatedQuestion) => {
//       if (!updatedQuestion) {
//         return res.status(404).json({ error: "Question not found" });
//       }
//       res.status(200).json(updatedQuestion);
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
// const editAnswer = (req, res, next) => {
//   const questionId = req.params.questionId;
//   const answerId = req.params.answerId;
//   const { text } = req.body;

//   Question.findOneAndUpdate(
//     { _id: questionId, "answers._id": answerId },
//     { $set: { "answers.$.text": text } },
//     { new: true }
//   )
//     .then((updatedQuestion) => {
//       if (!updatedQuestion) {
//         return res.status(404).json({ error: "Question not found" });
//       }
//       res.status(200).json(updatedQuestion);
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
// const editAnswer = (req, res, next) => {
//   const questionId = req.params.questionId;
//   const answerId = req.params.answerId;
//   const { text,link } = req.body;

//   Question.findOneAndUpdate(
//     { _id: questionId, "answers._id": answerId },
//     // { $set: { "answers.$.text": text, "answers.$.link": link,"answers.$.ownerName": req.user._id } },
//     { $set: { "answers.$.text": text, "answers.$.link": link} },
//     { new: true }
//   )
//     .populate('answers.ownerName', 'name tags') // add this line to populate the ownerName field with the user's name
//     .then((updatedQuestion) => {
//       if (!updatedQuestion) {
//         return res.status(404).json({ error: "Question not found" });
//       }
//       res.status(200).json(updatedQuestion);
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
const editAnswer = async (req, res, next) => {
  const questionId = req.params.questionId;
  const answerId = req.params.answerId;
  const { text, link } = req.body;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const answer = question.answers.find(a => a._id.toString() === answerId);
    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    if (!req.user.isAdmin &&req.user._id.toString() !== answer.ownerName.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: questionId, "answers._id": answerId },
      { $set: { "answers.$.text": text, "answers.$.link": link } },
      { new: true }
    ).populate('answers.ownerName', 'name tags');

    res.status(200).json(updatedQuestion);
  } catch (err) {
    next(err);
  }
};

// const removeAnswer = (req, res, next) => {
//   const questionId = req.params.questionId;
//   const answerId = req.params.answerId;

//   Question.findByIdAndUpdate(
//     questionId,
//     { $pull: { answers: { _id: answerId } } },
//     { new: true }
//   )
//     .then((updatedQuestion) => {
//       if (!updatedQuestion) {
//         return res.status(404).json({ error: "Question not found" });
//       }
//       res.status(200).json(updatedQuestion);
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
const removeAnswer = async (req, res, next) => {
  const questionId = req.params.questionId;
  const answerId = req.params.answerId;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const answer = question.answers.find(a => a._id.toString() === answerId);
    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    if (!req.user.isAdmin &&req.user._id.toString() !== answer.ownerName.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { $pull: { answers: { _id: answerId } } },
      { new: true }
    );

    res.status(200).json(updatedQuestion);
  } catch (err) {
    next(err);
  }
};

// const approveAnswer = async (req, res, next) => {
//   const questionId = req.params.questionId;
//   const answerId = req.params.answerId;

//   try {
//     const question = await Question.findById(questionId);
//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }

//     if (req.user._id.toString() !== question.owner.toString()) {
//       return res.status(403).json({ error: "Forbidden" });
//     }

//     const updatedQuestion = await Question.findOneAndUpdate(
//       { _id: questionId, "answers._id": answerId },
//       { $set: { "answers.$.approved": true }, answered: true },
//       { new: true }
//     );

//     const answer = updatedQuestion.answers.find(a => a._id.toString() === answerId);

//     const answerOwner = await User.findById(answer.ownerName);

//     if (answerOwner) {
//       answerOwner.tags = [...new Set([...answerOwner.tags, ...updatedQuestion.tags])];
//       await answerOwner.save();
//     }

//     res.status(200).json(updatedQuestion);
//   } catch (err) {
//     next(err);
//   }
// };
const approveAnswer = async (req, res, next) => {
  const questionId = req.params.questionId;
  const answerId = req.params.answerId;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (req.user._id.toString() !== question.owner.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (question.answered) {
      return res.status(400).json({ error: "Question already answered" });
    }
    const answer = question.answers.find(a => a._id.toString() === answerId);
    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    if (answer.approved) {
      return res.status(400).json({ error: "Answer already approved" });
    }

    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: questionId, "answers._id": answerId },
      { $set: { "answers.$.approved": true }, answered: true },
      { new: true }
    );

    const answerOwner = await User.findById(answer.ownerName);

    if (answerOwner) {
      answerOwner.tags = [...new Set([...answerOwner.tags, ...updatedQuestion.tags])];
      await answerOwner.save();
    }

    res.status(200).json(updatedQuestion);
  } catch (err) {
    next(err);
  }
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
// const upvoteAnswer = (req, res, next) => {
//   const questionId = req.params.questionId;
//   const answerId = req.params.answerId;
//   Question.findOneAndUpdate(
//     { _id: questionId, "answers._id": answerId },
//     { $inc: { "answers.$.upvotes": 1 } },
//     { new: true }
//   )
//     .then((updatedQuestion) => {
//       if (!updatedQuestion) {
//         return res.status(404).json({ error: "Question not found Upvote" });
//       }
//       res.status(200).json(updatedQuestion);
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
const upvoteAnswer = (req, res, next) => {
  const userId = req.user._id; // get the ID of the current user
  const questionId = req.params.questionId;
  const answerId = req.params.answerId;
  
  // check if the user has already upvoted the answer
  Question.findOne({ _id: questionId, "answers._id": answerId, "answers.upvotedBy": userId })
    .then((existingQuestion) => {
      if (existingQuestion) {
        return res.status(400).json({ error: "Answer has already been upvoted by this user" });
      }
      
      // add the user ID to the array of upvotedBy in the answer and increment the upvotes count
      return Question.findOneAndUpdate(
        { _id: questionId, "answers._id": answerId },
        { $addToSet: { "answers.$.upvotedBy": userId }, $inc: { "answers.$.upvotes": 1 } },
        { new: true }
      );
    })
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
// const addComment = (req, res, next) => {
//   const { text} = req.body;
//   const questionId = req.params.questionId;
//   const answerId = req.params.answerId;

//   if (!text) {
//     return res.status(400).send({ message: 'Text is required' });
//   }

//   Question.findOneAndUpdate(
//     { _id: questionId, "answers._id": answerId },
//     { $push: { "answers.$.comments": { text, user: req.user._id} } },
//     { new: true }
//   )
//     .then((updatedQuestion) => {
//       if (!updatedQuestion) {
//         return res.status(404).json({ error: "Question not found" });
//       }
//       res.status(200).json(updatedQuestion);
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
const addComment = (req, res, next) => {
  const { text } = req.body;
  const questionId = req.params.questionId;
  const answerId = req.params.answerId;

  if (!text) {
    return res.status(400).send({ message: 'Text is required' });
  }

  Question.findOneAndUpdate(
    { _id: questionId, "answers._id": answerId },
    { $push: { "answers.$.comments": { text, user: req.user._id, name: req.user.name } } },
    { new: true }
  )
    .populate('answers.comments.user', 'name') // add this line to populate the user field with the user's name
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
