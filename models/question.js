const mongoose = require('mongoose');

const { sampleUrl } = require('../config');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 1000,
  },
  link: {
    type:String,
    required:true,
    validate: {
      validator: (v) => sampleUrl.test(v),
      message: 'Enter link in format "http://google/...."',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  tags: {
    type: [String],
  },
  answers: [{
    _id: { type: mongoose.Schema.Types.ObjectId },
    text: { type: String },
    name: { type: String },
    user_name: { type: String },
    approved: { type: Boolean, default: false },
    grade: { type: Number, min: 0, max: 10, default: null },
    upvotes: { type: Number, default: 0 },
    comments: [{
      text: { type: String, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
      createdAt: { type: Date, default: Date.now() }
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
