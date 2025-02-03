const express = require("express");
const morgan = require("morgan");

const app = express();
const PORT = 3000;

const logger = (req, res, next) => {
    console.log(`Logger Middleware: ${req.method}  ${req.path}`);
    next();
};

app.use(logger);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// POST route
app.post("/", (req, res) => {
    res.send(req.body);
})

// Router-Level Middleware for /admin
const router = express.Router();
router.use((req, res, next) => {
    const authentication = req.query.auth;
    if (authentication) {
        console.log("Authentication successful");
        next(); 
    } else {
        res.status(401).send("Authentication failed");
    }
});

router.get("/", (req, res) => {
    res.send("Welcome to the admin panel!");
});

app.use("/admin", router);

// Test Error Route
app.get("/test-error", (req, res, next) => {
    next(new Error("Custom Error Occurred"));
});

// Error-Handling Middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`An error occurred ${err.message}`);
};

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});