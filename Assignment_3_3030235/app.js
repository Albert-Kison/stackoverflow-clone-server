const express = require('express');

const cors = require('cors');

const { celebrate, Joi, errors } = require('celebrate');

const mongoose = require('mongoose');
const Post = require('./models/post');

const bodyParser = require('body-parser');

const routesUsers = require('./routes/users');

const routesPosts = require('./routes/posts');

const { postUser, login } = require('./controllers/users');

const { requestLogger, errorLogger } = require('./midlewares/Logger');

const { auth } = require('./midlewares/auth');

const NotFoundError = require('./errors/NotFoundError');

// const { PORT = 3000 } = process.env;
// const { MONGODB_URI, PORT } = process.env;

const app = express();

 app.use(express.static('./dist'));

app.use(cors());

// const allowCrossDomain = function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   next();
// };
// app.use(allowCrossDomain);

// mongoose.connect('mongodb://localhost:27017/AssignmentDatabase', {
//   useNewUrlParser: true,
// });
mongoose.connect(
  process.env.MONGODB_URI,
  {
  useNewUrlParser: true,
  useNewUrlParser:true,
}
)


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
  '/api/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.get('/api/getPosts',(req,res) => {
  Post.find({})
    .then((posts) => {
      res.status(200).send(posts);
    })
});
app.use(auth);
app.use('/api/users', routesUsers);
app.use('/api/posts', routesPosts);
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
