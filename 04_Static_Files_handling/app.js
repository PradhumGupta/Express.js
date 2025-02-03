const express = require("express");
const path = require("path");

const PORT = 3000;
const app = express();

// serve static files
app.use("/static", express.static("public", { maxAge: "80s" }));
app.use("/assets", express.static("assets", { maxAge: "1h" }));

// Serve index.html or a individual file as the homepage
app.get('/', (req, res) => {
    console.log(req.headers);
    console.log(req.headers['content-type']);
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Dynamic route to inject username into HTML
app.get("/welcome/:username", (req, res) => {
    const username = req.params.username;
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Dynamic Welcome</title>
            <link rel="stylesheet" href="/static/style.css">
        </head>
        <body>
            <h1>Welcome, ${username}!</h1>
            <script src="/static/app.js"></script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});