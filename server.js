const fs = require("fs");
const exp = require("express");
const morgan = require("morgan");
const app = exp();

// ====================================middlewares===============================================
// middleware -- > is a function used to modify incoming request data

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
// ==============================================================================

// app.get('/', (req, res) => {
// .json -->automatically set content-type to application/json
//     res.status(200).json({ message: 'Hello from the server side!', app: 'Natours' });
// })

// app.post('/', (req, res) => {
//     res.send('You can Post to this end Point')
// })

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
// or
const x = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));
// ===========================Route Handlers==============================
// ==========================GET ALL TOURS & Users REQUEST======================================================

const getAllTours = (req, res) => {
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

const getAllUsers = (req, res) => {
  res.status(500).send({
    status: "error",
    message: "This route is not yet defined",
  });
};

// ==========================GET TOUR by using id===============================================
const getTour = (req, res) => {
  // console.log(req.params);

  const id = req.params.id * 1;
  const tour = x.find((data) => data.id === id);

  // !tour or id>req.params.id
  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: "Invalid Id",
    });
  }
  res.status(200).json({
    status: "success",
    tour,
  });
};

const getUser = (req, res) => {
  res.status(500).send({
    status: "error",
    message: "This route is not yet defined",
  });
};
// ===========================POST REQUEST=================================================

const createTour = (req, res) => {
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

const createUser = (req, res) => {
  res.status(500).send({
    status: "error",
    message: "This route is not yet defined",
  });
};

// =========================PATCH===========================================================

const updateTour = (req, res) => {
  if (req.params.id * 1 > x.length) {
    return res.status(404).json({
      status: "failed",
      message: "Invalid Id",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>",
    },
  });
};

const updateUser = (req, res) => {
  res.status(500).send({
    status: "error",
    message: "This route is not yet defined",
  });
};

// =========================DELETE ===========================================================

const deleteTour = (req, res) => {
  if (req.params.id * 1 > x.length) {
    return res.status(404).json({
      status: "failed",
      message: "Invalid Id",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};

const deleteUser = (req, res) => {
  res.status(500).send({
    status: "error",
    message: "This route is not yet defined",
  });
};

// ==============================ROUTES========================
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

//              u can use any of the above format

const tourRouter = exp.Router();
const userRouter = exp.Router();

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// ========================tours==============================
tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

//   =================USERS====================
userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
// =======================================START SERVER===============================================

const port = 3000;
app.listen(port, () => {
  console.log(`server started on port ${port} successfully!😁`);
});
