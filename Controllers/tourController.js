const fs = require("fs");
const x = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));

// ==========================GET ALL TOURS & Users REQUEST======================================================
exports.checkID = (req, res, next, val) => {
  if (req.params.id * 1 > x.length) {
    return res.status(404).json({
      status: "failed",
      message: "Invalid Id",
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    results: x.length,
    data: {
      // tours : x
      x,
    },
  });
};

// ==========================GET TOUR by using id===============================================
exports.getTour = (req, res) => {
  // console.log(req.params);

  const id = req.params.id * 1;
  const tour = x.find((data) => data.id === id);
  res.status(200).json({
    status: "success",
    tour,
  });
};

// ===========================POST REQUEST=================================================

exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = x[x.length - 1].id + 1;
  const newTour = Object.assign(
    {
      id: newId,
    },
    req.body
  );
  x.push(newTour);

  fs.writeFile(
    "./dev-data/data/tours-simple.json",
    JSON.stringify(x),
    (err) => {
      res.status(201).send({
        status: "success",
        data: {
          tours: newTour,
        },
      });
    }
  );
};

// =========================PATCH===========================================================

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>",
    },
  });
};

// =========================DELETE ===========================================================

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
