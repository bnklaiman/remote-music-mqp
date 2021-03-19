// Load Node modules, initialize Express
const express = require('express');
const app = express();
const fs = require('fs');

// eval(fs.readFileSync('public/js/everything.js'));

// Render static files
app.use(express.static('public'));

// Port website will run on
app.listen(8080);