const Post = require('../models/post');

const CastError = require('../errors/CastError');

const ForbiddenError = require('../errors/ForbiddenError');

const NotFoundError = require('../errors/NotFoundError');

const ValidationError = require('../errors/ValidationError');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const createPost = (req, res, next) => {
  const {link,text} = req.body;
  Post.create({link,text, owner: req.user._id })
    .then((post) => res.status(200).send(post))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Wrond data transferred'));
      }
      next(err);
    });
};
const editPost = (req, res, next) => {
  const { link, text } = req.body;
  const postId = req.params.id;

  Post.findByIdAndUpdate(
    postId,
    { link, text },
    { new: true }
  )
    .then((post) => {
      if (!post) {
        throw new NotFoundError('Post not found');
      }
      res.status(200).send(post);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid post ID'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Invalid post data'));
      } else {
        next(err);
      }
    });
};
const deletePost = (req, res, next) => {
  Post.findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError('No Post with this id!');
    })
    .then((post) => {
        Post.findByIdAndRemove(req.params._id)
          .then((data) => res
            .status(200)
            .send({ data, message: 'Post was deleted!' }))
          .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Unvalid id of post'));
      }
      next(err);
    });
};

const addComment = (req, res, next) => {
  const { text, name } = req.body;

  if (!text || !name) {
    return res.status(400).send({ message: 'Text and name are required' });
  }

  const postId = req.params._id;
  const commentId = new ObjectId();

  Post.findByIdAndUpdate(
    postId,
    { $push: { comments: { _id: commentId,text, name, user_name: req.user.name } } },
    { new: true }
  )
    .then((updatedPost) => {
      res.status(200).send(updatedPost);
    })
    .catch((err) => {
      next(err);
    });
};
const editComment = (req, res, next) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const updatedComment = req.body;

  Post.findOneAndUpdate(
    { _id: postId, "comments._id": commentId },
    { $set: { "comments.$": updatedComment } },
    { new: true }
  )
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.status(200).json(updatedPost);
    })
    .catch((err) => {
      next(err);
    });
};

const removeComment = (req, res, next) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  Post.findByIdAndUpdate(
    postId,
    { $pull: { comments: { _id: commentId } } },
    { new: true }
  )
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.status(200).json(updatedPost);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createPost,
  deletePost,
  addComment,
  removeComment,
  editPost,
  editComment

};
