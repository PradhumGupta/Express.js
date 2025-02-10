// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(255) NOT NULL,
//     email VARCHAR(255) NOT NULL UNIQUE,
//     password VARCHAR(255) NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );


const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "express_app",
});

db.connect((err) => {
    if(err) {
        console.error('Error connecting to MySQL', err.message);
        return;
    }
    console.log('Connected to MySQL database!');
});

module.exports = db;
