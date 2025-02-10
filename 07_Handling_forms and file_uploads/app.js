const express = require("express");
const multer = require("multer");
const path = require("path");

const PORT = 3000;

const app = express();
const upload = multer({ 
    dest: './uploads',
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if(allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only .jpg, .png, .pdf, and .docx files are allowed!"), false);
        }
    },
});

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
    res.send(`
        <h1> Fill this form below </h1>
        <form action="/submit" method="POST" enctype="multipart/form-data">
            <label for="name">Name: </label>
            <input type="text" name="name" id="name" required> <br/>
            <label for="email">Email: </label>
            <input type="email" name="email" id="email" required> <br/>
            <label for="file">Profile upload:</label>
            <input type="file" name="file" id="file" required> <br/>
            <button type="submit">Submit</button>
        </form>
    `);
});

app.post("/submit", upload.single('file'), (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const profileImg = req.file ? `/uploads/${req.file.filename}` : null;
    res.send(`Form submitted! Hello, ${name}.
        <p>Your information is given below:</p>
        ${profileImg ? `<p>Profile Image:</p> <img src="${profileImg}" width="200" alt="Profile Picture"/>` : ''}
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <hr/>
        <h2>Also Upload Important documents related to your work like Resume, CV etc.</h2>
        <form action="/upload" method="POST" enctype="multipart/form-data">
            <label for="files">Choose some files: </label>
            <input type="file" name="files" id="files" multiple required> 
            <button type="submit">Upload</button>
        </form>
    `);     
});

app.post("/upload", upload.array('files', 3), (req, res) => {
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).send("No files uploaded!");
    }

    const fileList = files.map(file => `<li>${file.originalname} - <a href="/uploads/${file.filename}" download>Download</a></li>`).join("");

    res.send(`
        <h1>File Upload Successful</h1>
        <p>Uploaded ${files.length} files:</p>
        <ul>${fileList}</ul>
        <a href="/">Go Back</a>
    `);
});


app.listen(PORT, () => {
    console.log("Server is running on http://localhost:3000");
});
