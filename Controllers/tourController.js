// import tour model
const Tour = require('../Models/tourModel');

// ==========================GET ALL TOURS & Users REQUEST======================================================

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: x.length,
    // data: {
    // tours : x
    //   x,
    // },
  });
};

// ==========================GET TOUR by using id===============================================
exports.getTour = (req, res) => {
  // console.log(req.params);

  const id = req.params.id * 1;
  // const tour = x.find((data) => data.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   tour,
  // });
};

// ===========================POST REQUEST=================================================

exports.createTour = (req, res) => {
  // console.log(req.body);
  res.status(201).send({
    status: 'success',
    // data: {
    //   tours: newTour,
    // },
  });
};

// =========================PATCH===========================================================

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

// =========================DELETE ===========================================================

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
