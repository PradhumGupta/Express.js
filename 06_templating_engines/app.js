const express = require("express");

const PORT = 3000;
const app = express();

app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', './views');  // Specify the directory for template files

app.get("/", (req, res) => {
    res.send(`
        <h1>Home Page</h1>
        <nav>
            <a href="/profile">Profile</a>
            <a href="/products">Products</a>
            <a href="/error-demo">Error Demo</a>
        </nav>
    `);
});


app.get("/profile", (req, res) => {
    const user = {
        name: "Pradhum",
        age: "19",
        work: "learning"
    };
    const err = null;
    res.render("profile", { user, err });
});

app.get("/products", (req, res) => {
    const items = ["node.js", "express.js", "mongoDB", "React"];
    res.render("products", { items });
});

app.get("/error-demo", (req, res) => {
    const err = new Error("Something went wrong");
    res.render('profile', { user: null, err: err.message });
});

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:3000");
});