const fs = require('fs');
const exp = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

const dbrul =
  'mongodb+srv://<username>:<password>@cluster0.wr0ge.mongodb.net/<databasename>?retryWrites=true&w=majority';
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
dotenv.config({ path: '/config.env' });
// importing routes
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

// creating express object
const app = exp();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(exp.json());
app.use(exp.static(`${__dirname}/public`));
// middleware --applies for every single request
app.use((req, res, next) => {
  console.log('hello from middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//infrom to express application -  mounting routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`server started on port ${port} successfully!😁`);
});
