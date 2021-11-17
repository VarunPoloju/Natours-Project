const fs = require("fs");
const exp = require("express");

const app = exp();

// middleware -- > is a function used to modify incoming request data
app.use(exp.json());

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

// ==========================GET ALL TOURS REQUEST======================================================

const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        results: x.length,
        data: {
            // tours : x
            x,
        },
    });
};

app.get("/api/v1/tours", getAllTours);

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
app.get("/api/v1/tours/:id", getTour);

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
app.post("/api/v1/tours", createTour);

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

app.patch("/api/v1/tours/:id", updateTour);

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
app.delete("/api/v1/tours/:id", deleteTour);

// ======================================================================================
const port = 3000;
app.listen(port, () => {
    console.log(`server started on port ${port} successfully!😁`);
});
