const express = require("express");
const { check, body, validationResult } = require("express-validator");

const app = express();
const PORT = 3000;

app.use(express.json());

const bookRouter = express.Router();

bookRouter.use((req, res, next) => {
    console.log('Router Middleware Active.');
    next();
});

const books = [
    { id: 1, title: "1984", author: "George Orwell"},
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee"},
];


// Validation for request body (title, author)
const validateBook = [
    body('title').notEmpty().withMessage("Title is required"),
    check('author').notEmpty().withMessage("Author is required"),
];

// Validation for URL parameters (id)
const validateId = [
    check("id").isInt().withMessage("Id must be an integer"),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// GET: Retrieve All Books
bookRouter.get("/", (req, res) => {
    res.status(200).json(books);
});

// GET: Retrieve a single book by id
bookRouter.get("/:id", validateId, validate, (req, res) => {
    let book = books.find(b => b.id === parseInt(req.params.id));
    if(!book) {
        return res.status(404).send('Book not found');
    }
    res.status(200).json(book);
});

bookRouter.post("/", validateBook, validate, (req, res) => {
    // Manual validation
    // const { title, author } = req.body;
    // if(!title || !author) {
    //     return res.status(400).send("Title and author both are necessary");
    // }

    const { title, author }  = req.body;
    let newBook = { id: books.length + 1, title, author };
    books.push(newBook);
    res.status(201).json(newBook);
});

bookRouter.put("/:id", [...validateId, ...validateBook], validate, (req, res) => {
    let book = books.find(b => b.id === parseInt(req.params.id));
    if(!book) {
        return res.status(404).send('Book not found');
    }

    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;

    res.status(200).json(book);
});

bookRouter.delete("/:id", validateId, validate, (req, res) => {
    let bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if(bookIndex === -1) {
        return res.status(404).send("Book not found");
    }

    const deletedBook = books.splice(bookIndex, 1);
    res.status(200).json(deletedBook);
});

app.use("/api/books", bookRouter);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));