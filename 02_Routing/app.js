const express = require("express");

const PORT = 3000;
const app = express();

app.get("/home", (req, res) => {
    res.send("Welcome! This is Pradhum's App. What would you like to use. To check our services move to '/services'");
});

app.get("/services", (req, res) => {
    res.send("We offer many services including ...");
});

app.get("/contact", (req, res) => {
    res.send("Contact us at user@example.com");
});

app.get("user/:username", (req, res) => {
    const username = req.params.username;
    res.send(`Hello, ${username}`);
});

// search route
app.get("/search", (req, res) => {
    const query = req.query.q;
    if(query) {
        res.send(`You searched for query: ${query}`);
    } else {
        res.send("No search term provided");
    }
});

// Blog Route with ID and Query String
app.get("/blog/:id", (req, res) => {
    const postId = req.params.id;
    const sort = req.query.sort || "none";
    res.send(`Post ID: ${postId}, Sort: ${sort}`);
});

app.use((req, res) => {
        res.status(404).send("Not Found the requested page")
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});