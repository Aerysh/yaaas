const express = require('express');
require('dotenv/config');
const APP_PORT = process.env.APP_PORT || 8000;
const app = express();

app.get('/', async(req, res) => {
    res.json({message: "Manhwaindo.id API, https://github.com/Aerysh"});
});

app.listen(APP_PORT, () => {
    console.log(`App listening http://localhost:${APP_PORT}`);
});