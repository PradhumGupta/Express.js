const express = require("express");
const User = require("./connectDb");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/users', async (req, res) => {
    try {
        const { username, email, password, roles } = req.body;
        const user = new User({ username, email, password, roles });
        await user.save();
        res.status(201).json({ message: 'User Created', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });  
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        const user = await User.findByIdAndUpdate(id, { email }, { new: true });
        res.status(200).json({ message: 'User updated', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// create route to filter users by roles.
app.get('/users/roles', async (req, res) => {
    try {
        const { role } = req.query; // Get role from query parameter
        
        if (!role) {
            return res.status(400).json({ error: "Role query parameter is required" });
        }

        const users = await User.find({ roles: role });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });  
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});