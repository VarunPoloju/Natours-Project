// import tour model
const Tour = require('../Models/tourModel');

const APIFeatures = require('../Utils/apiFeatures');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// ==========================GET ALL TOURS & Users REQUEST======================================================

exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const getAllTours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: getAllTours.length,
    data: {
      getAllTours,
    },
  });
});

// ==========================GET TOUR by using id===============================================
exports.getTour = catchAsync(async (req, res, next) => {
  const tourById = await Tour.findById(req.params.id);
  if (!tourById) {
    return next(new AppError('No tour find with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tourById,
    },
  });
});

// ===========================POST REQUEST=================================================

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).send({
    status: 'success',
    data: {
      tours: newTour,
    },
  });
});

// =========================PATCH===========================================================

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedTour) {
    return next(new AppError('No tour find with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      updatedTour,
    },
  });
});

// =========================DELETE ===========================================================

exports.deleteTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);
  if (!deletedTour) {
    return next(new AppError('No tour find with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: {
      deletedTour,
    },
  });
});

// =======================================AGGREGATION PIPLINE=====================
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 3.0 } },
    },
    {
      $group: {
        // allows to group docs together
        //suppose if we have 5 tours, each of them has rating, we can calculate average rating using group
        // _id: '$ratingsAverage',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// ==================================================================================

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; //2021
  const plan = await Tour.aggregate([
    {
      // unwind -> it will deconstruct an array field from input documents and then output one document for each ele of array
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numberOfTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      //  -1 ->> for showing in descending order
      $sort: { numberOfTours: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
