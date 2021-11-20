// import tour model
const Tour = require('../Models/tourModel');

// ==========================GET ALL TOURS & Users REQUEST======================================================

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // ... --->destructuring
    // 1A) FILTERING
    // console.log(req.query);
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING

    // if there is a sort in query of the url then this will execute
    // like if in url localhost:3000/api/v1/tours?sort=-price if u see like this it will sort price in
    // descending ordr , remoe minus it will be ascending order
    if (req.query.sort) {
      // if the price is same while sorting then u need to go for other criteria like ratingsAverage or whatever
      // localhost:3000/api/v1/tours?sort=-price,-ratingsAverage like this
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);
      query = query.sort(sortBy);
    }
    // if user don't specify any kind of sort then this will execute
    else {
      query = query.sort('-CreatedAt');
    }

    // 3) FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // it is selecting only particular fields like name,price etc --> it's called as projecting
      // ex:localhost:3000/api/v1/tours?fields=name,duration,price,difficulty
      query = query.select('name duration price difficulty');
    } else {
      query = query.select('-__v');
    }

    // 4) PAGINATION
    // page=2&limit=10  --> 1-10 page 1 ,, 11-20 page 2 ,, 21-30  page3
    // query = query.skip(10).limit(10);
    //skip(10) means it should skip 10 results in page 1 and show 10 rem 10 results i.e limit(10) means it should show 10  results for that page

    // setting default page as 1
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // when there
    // if no of documnents we skip is greater than no of docs exist then that page not exist
    if (req.query.page) {
      const numberofTours = await Tour.countDocuments();
      if (skip >= numberofTours) {
        throw new Error('This page does not exist');
      }
    }
    // EXECUTE QUERY
    const getAllTours = await query;
    // query.sort().select().skip().limit()

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
