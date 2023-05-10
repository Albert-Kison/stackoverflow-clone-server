const express = require('express');

const cors = require('cors');

const { celebrate, Joi, errors } = require('celebrate');

const mongoose = require('mongoose');
const Question = require('./models/question');

const bodyParser = require('body-parser');

const routesUsers = require('./routes/users');

const routesQuestions = require('./routes/questions');

const { postUser, login } = require('./controllers/users');

const { requestLogger, errorLogger } = require('./midlewares/Logger');

const { auth } = require('./midlewares/auth');

const NotFoundError = require('./errors/NotFoundError');

const app = express();

// app.use(express.static('./dist'));

app.use(cors());

mongoose.connect(
  // process.env.MONGODB_URI,
  // 'mongodb://localhost:27017/mydatabase',
  "mongodb+srv://IvanAdmin:iuytrewq@finalassignment.jkd5oe8.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useNewUrlParser:true,
  }
);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB Atlas');
});
app.use(bodyParser.json());

app.use(requestLogger);

app.post(
  '/api/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  postUser,
);

app.post(
  '/api/expertSignUp',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      tags: Joi.array().items(Joi.string()),
    }),
  }),
  postUser,
);

app.post(
  '/api/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

app.get('/api/getQuestions',(req,res) => {
  Question.find({})
    .then((questions) => {
      res.status(200).send(questions);
    })
});

app.use(auth);

app.use('/api/users', routesUsers);

app.use('/api/questions', routesQuestions);

app.use('*', () => {
  throw new NotFoundError('Requested Page does not exist!');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Server error'
        : `Error: ${message}`,
    });
  next();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
// app.listen(3000, () => {
//   console.log(`App listening on port 3000`);
// });