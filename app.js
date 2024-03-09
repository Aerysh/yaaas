import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());

import AllRouter from './routes/all.js';
import DetailRouter from './routes/detail.js';
import GenreRouter from './routes/genres.js';
import LatestRouter from './routes/latest.js';
import ReadRouter from './routes/read.js';
import SearchRouter from './routes/search.js';
import PopularRouter from './routes/weekPopular.js';

app.use('/all', AllRouter);
app.use('/detail', DetailRouter);
app.use('/genre', GenreRouter);
app.use('/latest', LatestRouter);
app.use('/read', ReadRouter);
app.use('/search', SearchRouter);
app.use('/popular', PopularRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Manhwaindo.id API, https://github.com/Aerysh/manhwaindo-api' });
});

app.listen(PORT, () => {
  console.log(`App listening http://localhost:${PORT}`);
});
