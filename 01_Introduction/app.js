const express = require("express");

const PORT = 3000;

const app = express();

app.get("/name", (req, res) => {
    res.status(200).send("Hello Pradhum!");
});

app.get("/about", (req, res) => {
    res.send(`<h1>Express.js is a web application framework for Node.js. It simplifies building web servers by providing powerful tools for handling HTTP requests, routing, middleware, and much more. Think of it as a lightweight and flexible framework to streamline server-side development.</h1>`)
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});