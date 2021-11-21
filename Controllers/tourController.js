// import tour model
const Tour = require('../Models/tourModel');

const APIFeatures = require('../Utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// ==========================GET ALL TOURS & Users REQUEST======================================================

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const getAllTours = await features.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: getAllTours.length,
      data: {
        getAllTours,
      },
    });
  } catch (err) {
    res.send(404).json({
      status: 'failed',
      message: err,
    });
  }
};

// ==========================GET TOUR by using id===============================================
exports.getTour = async (req, res) => {
  try {
    const tourById = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tourById,
      },
    });
  } catch (err) {
    res.send(404).json({
      status: 'failed',
      message: 'invalid id',
    });
  }
};

// ===========================POST REQUEST=================================================

exports.createTour = async (req, res) => {
  try {
    // console.log(req.body);
    // const newTour = new Tour({});
    // newTour.save();

    // or

    const newTour = await Tour.create(req.body);

    res.status(201).send({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

// =========================PATCH===========================================================

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        updatedTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

// =========================DELETE ===========================================================

exports.deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        deletedTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

// =======================================AGGREGATION PIPLINE=====================
exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }
};

// ==================================================================================

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }
};
