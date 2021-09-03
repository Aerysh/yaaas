const express = require('express');
require('dotenv/config');
const APP_PORT = process.env.APP_PORT || 8000;
const app = express();

// Import Router
const latestRouter = require('./routes/latest');
const detailRouter = require('./routes/detail');
const readRouter = require('./routes/read');

app.use('/latest', latestRouter);
app.use('/detail', detailRouter);
app.use('/read', readRouter);

app.get('/', (req, res) => {
    res.json({message: "Manhwaindo.id API, https://github.com/Aerysh"});
});

app.listen(APP_PORT, () => {
    console.log(`App listening http://localhost:${APP_PORT}`);
});