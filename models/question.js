const mongoose = require('mongoose');

const { sampleUrl } = require('../config');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000,
  },
  image: {
    type: String,
    required: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: 'name'
  },
  tags: {
    type: [String],
  },
  answers: [{
    _id: { type: mongoose.Schema.Types.ObjectId },
    text: { type: String },
    ownerName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      select: 'name'
    },
    approved: { type: Boolean, default: false },
    grade: { type: Number, min: 0, max: 10, default: null },
    upvotes: { type: Number, default: 0 },
    comments: [{
      text: { type: String, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true,select: 'name'},
      createdAt: { type: Date, default: Date.now() },
      name: { type: String },
    }],
    createdAt: { type: Date, default: Date.now() }
}],
  answered: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('question', questionSchema);
