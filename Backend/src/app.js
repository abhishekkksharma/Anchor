const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require("./routes/user"); // example
const adminRoutes = require('./routes/admin');
const {} = require('./mildewares/authMiddleware');
const authMiddleware = require("./mildewares/authMiddleware");

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.get("/", (req, res) => {
    return res.send("Hello World!");
});

app.use('/user', userRoutes);
app.use('/admin', adminRoutes)


module.exports = app;
