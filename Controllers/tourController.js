// import tour model
const Tour = require('../Models/tourModel');

// ==========================GET ALL TOURS & Users REQUEST======================================================

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // ... --->destructuring
    // 1)FILTERING
    // console.log(req.query);
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2)ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    const query = Tour.find(JSON.parse(queryStr));
    // EXECUTE QUERY
    const getAllTours = await query;

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
