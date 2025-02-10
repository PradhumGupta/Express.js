const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/express_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => console.error('MongoDB connection error', err));
db.once('open', () => {
    console.log('Connected to MongoDB database');
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], required: true }
});

const User = mongoose.model('User', userSchema);
module.exports = User;