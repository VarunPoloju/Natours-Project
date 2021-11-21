// mongoose package
const mongoose = require('mongoose');
const slugify = require('slugify');
const toursSchema = new mongoose.Schema(
  // schema definition
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
    },
    slugify: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have maximum group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have price'],
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      //trim-- remove all white spaces
      trim: true,
      required: [true, 'A tour must have description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image'],
    },
    images: [String],
    // it's an array of strings
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  // options
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//converting  days we have  -- > weeks
// this.duration/ 7 ===> to calculate duration in weeks
toursSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

//=========================== DOCUMENT MIDDLEWARE====================
// it runs only before .save() and .create()
// pre -middleware which is gonna run before an actual event
// save --> it's an event
// function() --> will be called before an actual document is saved to database
toursSchema.pre('save', function (next) {
  // console.log(this);
  this.slugify = slugify(this.name, { lower: true });
  next();
});

// toursSchema.pre('save', function (next) {
//   console.log('Will save document');
//   next();
// });

// POST MIDDLEWARE
// toursSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });


const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
