const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/user");
const adminRoutes = require('./routes/admin');

// middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
}));
app.use(express.json());

// routes
app.get("/", (req, res) => {
    return res.send("Hello World!");
});

app.use('/user', userRoutes);
app.use('/admin', adminRoutes)


module.exports = app;
