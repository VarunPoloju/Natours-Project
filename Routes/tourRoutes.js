const exp = require("express");

const tourController = require("../Controllers/tourController");

const tourRouter = exp.Router();

tourRouter
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);
tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
