const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../Models/tourModel');

dotenv.config({ path: '/config.env' });

const dbrul =
  'mongodb+srv://cdbsample:cdbsample@cluster0.wr0ge.mongodb.net/natours?retryWrites=true&w=majority';
// mongoose package

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

// read json file
const toursJsonFile = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import data into databse

const importData = async () => {
  try {
    await Tour.create(toursJsonFile);
    console.log('Data loaded successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete all data from DB

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
