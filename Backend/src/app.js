const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
// const routes = require("./api/routes"); // example

// middlewares
app.use(express.json());

// routes
app.get("/", (req, res) => {    
    return res.send("Hello World!");
});

module.exports = app;
