const exp = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const dbrul =
  'mongodb+srv://cdbsample:cdbsample@cluster0.wr0ge.mongodb.net/natours?retryWrites=true&w=majority';
// mongoose package
const mongoose = require('mongoose');

mongoose.connect(
  dbrul,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err, client) => {
    if (err) {
      console.log('error in db connect', err);
    } else {
      console.log('connected to database');
    }
  }
);

// console.log(process.env);
dotenv.config({ path: '/.env' });

// importing
const AppError = require('./Utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

// creating express object
const app = exp();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// middleware --applies for every single request
app.use(exp.json());
app.use(exp.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('hello from middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//infrom to express application -  mounting routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// for invalid path  --> not much better
// runs only for one particular url
// app.use((req, res, next) => {
//   res.send({ message: `${req.url} is not a valid path` });
// });

//For handling invalid paths --> much better
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Failed',
  //   message: `Can't find ${req.url} on this server!`,
  // });
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// for error handler middleware
app.use(globalErrorHandler);

const port = 3000;
app.listen(port, () => {
  console.log(`server started on port ${port} successfully!😁`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
