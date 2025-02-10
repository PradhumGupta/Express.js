const express = require("express");
const { param, body, validationResult } = require("express-validator");
const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [];
let idCounter = 1;

const isValidFutureDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate) && parsedDate > Date.now();
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).send({errors: errors.array()});
    } 
    next();
}

app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

app.get("/tasks/:id", [
    param("id").isInt().withMessage("id must be a positive integer") ],
    validate, (req, res) => {
        const todo = tasks.find(t => t.id === parseInt(req.params.id));
        if(!todo) {
            return res.status(404).json("task not found");
        }
        res.status(200).json(todo);
    }
);

app.post("/tasks", [
    body("task").isString().isLength({ min: 3 }).withMessage("Task is required and must be of at least 3 characters"),
    body("status").optional().isBoolean().withMessage("Status may be true or false"),
    body("deadline").custom(value => {
        if(!isValidFutureDate(value)) {
            throw new Error("Deadline must be a valid future date.");
        }
        return true;
    })
], validate, (req, res) => {
    let { task, status, deadline } = req.body;
    const newTask = {
        id : idCounter++,
        task,
        status: status || false, 
        deadline
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put("/tasks/:id", [
    param("id").isInt().withMessage("id must be a positive integer"),
    body("task").optional().isString().isLength({ min: 3 }).withMessage("Task is required and must be of at least 3 characters"),
    body("status").optional().isBoolean().default(true).withMessage("Status may be true or false"),
    body("deadline").optional().custom(value => {
        if(!isValidFutureDate(value)) {
            throw new Error("Deadline must be a valid future date.");
        }
        return true;
    })
], validate, (req, res) => {
    const todo = tasks.find(t => t.id === parseInt(req.params.id));
    console.log(todo);
    if(!todo) {
        return res.status(404).json("task not found");
    }
    let { task, status, deadline } = req.body;

    if (req.body.hasOwnProperty("task")) todo.task = task;
    if (req.body.hasOwnProperty("status")) todo.status = status;
    if (req.body.hasOwnProperty("deadline")) todo.deadline = deadline;
    
    res.status(201).json(todo);
});

app.delete("/tasks/:id", [
    param("id").isInt().withMessage("id must be a positive integer") ],
    validate, (req, res) => {
        const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));

        if(taskIndex == -1) {
            return res.status(404).json("task not found");
        }
        const deletedTask = tasks.splice(taskIndex, 1);
        res.status(200).json(taskIndex);
    }
);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});