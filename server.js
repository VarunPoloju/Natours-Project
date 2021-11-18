const fs = require("fs");
const exp = require("express");
const morgan = require("morgan");

// importing routes
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");

// creating express object
const app = exp();

app.use(morgan("dev"));
app.use(exp.json());

// middleware --applies for every single request
app.use((req, res, next) => {
  console.log("hello from middleware 👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// mounting routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);


const port = 3000;
app.listen(port, () => {
  console.log(`server started on port ${port} successfully!😁`);
});
