const express = require("express");
const db = require("./connectDb");

const app = express();
const PORT = 5000;

app.use(express.json());

app.post('/users', (req, res) => {
    const { username, email, password } = req.body;
    const query = 'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())';

    db.query(query, [username, email, password], (err, result) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User Created', userId: result.insertId });
    });
});

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    
    db.query(query, (err, results) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { email } = req.body;
    const query = 'UPDATE users SET email = ? WHERE id = ?';

    db.query(query, [email, id], (err, result) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'User updated' });
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'User deleted '});
    });
});

// Add a created_at column to the MySQL users table and implement a route to fetch users created within a specific date range.
app.get('/users/:fromDate/:toDate', (req, res) => {
    const { fromDate, toDate } = req.params;
    console.log(fromDate, toDate);
    const query = `SELECT * FROM users WHERE created_at BETWEEN ? AND ?`;

    db.query(query, [fromDate, toDate], (err, results) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});