const express = require('express');
require('dotenv/config');
const PORT = process.env.PORT || 8000;
const app = express();

// Import Router
const allRouter = require('./routes/all');
const latestRouter = require('./routes/latest');
const searchRouter = require('./routes/search');
const detailRouter = require('./routes/detail');
const readRouter = require('./routes/read');

app.use('/all', allRouter);
app.use('/latest', latestRouter);
app.use('/search', searchRouter);
app.use('/detail', detailRouter);
app.use('/read', readRouter);

app.get('/', (req, res) => {
    res.json({message: "Manhwaindo.id API, https://github.com/Aerysh"});
});

app.listen(PORT, () => {
    console.log(`App listening http://localhost:${PORT}`);
});