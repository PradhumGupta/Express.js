const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3020;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage: storage, // dest or storage as key can be used
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if(file.mimetype.startsWith("image/") || 
            file.mimetype === "application/pdf" || 
            file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            cb(null, true);
        } else {
            cb(new Error("Only images, PDFs, and DOCX files are allowed."));
        }
    },
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.send(`
        <form action="/upload" method="POST" enctype="multipart/form-data">
            <label for="files">Select files: </label>
            <input type="file" name="files" id="files" multiple required> 
            <button type="submit">Upload</button>
        </form>
    `);
});

app.post("/upload", upload.array("files", 10), (req, res) => {
    if(!req.files || req.files.length == 0) {
        return res.status(400).send("No files uploaded.");
    }
    res.redirect("/gallery");
});

app.get("/gallery", (req, res) => {
    fs.readdir("uploads/", (err, files) => {
        if(err) {
            return res.status(500).send("Unable to load gallery.");
        }
        // console.log(files)
        let fileList = files.map(file => {
            let fileUrl = `/uploads/${file}`;
            // console.log(fileUrl)
            if(file.endsWith(".pdf") || file.endsWith(".docx")) {
                return `<li><a href="${fileUrl}" target="_blank">${file}</a></li>`;
            } else {
                return `<img src="${fileUrl}" width="200" height="150" style="margin: 10px;"/>`
            }
        }).join();
        // console.log(fileList);
        res.send(`
            <h1>Uploaded Files Gallery</h1>
            <div>${fileList}</div>
            <a href="/">Upload More Files</a>
        `);
    });
});

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:3020");
});