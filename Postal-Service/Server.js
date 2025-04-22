"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var dotenv = require("dotenv");
var routes_1 = require("./routes/routes");
dotenv.config();
var app = express();
var PORT = parseInt(process.env.PORT || '3000');
app.use(express.json());
// Serve static frontend files from "public"
app.use(express.static(path.join(__dirname, "../public")));

// Default route should serve the main HTML page
app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "../public", "postal-service.html"));
});


// Routes
app.use('/api', routes_1.default);
// Root
app.get('/', function (_req, res) {
    res.send('Postal Service API is running...');
});
// Start server
app.listen(PORT, function () {
    console.log("Server is listening on port ".concat(PORT));
});
