// Load Node modules, initialize Express
const express = require('express');
const app = express();

// Render static files
app.use(express.static('public'));

// Port website will run on
app.listen(8080);