// mongoose package
const mongoose = require('mongoose');

const toursSchema = new mongoose.Schema(
  // schema definition
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
    },
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
const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
