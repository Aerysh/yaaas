import express from 'express';
import cheerio from 'cheerio';
import Browser from '../helpers/puppeteer.js';
import UrlHelper from '../helpers/url.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const browser = await Browser();
    const page = await browser.newPage();
    await page.goto(UrlHelper.base);
    const content = await page.content();

    const $ = cheerio.load(content);
    const genreList = $('#sidebar .section .genre li');
    const genres = [];
    genreList.each((idx, el) => {
      const genre = { name: '', endpoint: '' };
      genre.name = $(el).find('a').text();
      genre.endpoint = $(el).find('a').attr('href').replace('https://manhwaindo.id/genres/', '');

      genres.push(genre);
    });

    await page.close();
    await browser.close();

    res.json({ message: 'Genres List', genres: genres });
  } catch (err) {
    res.json({ message: err });
  }
});

router.get('/:endpoint', async (req, res) => {
  try {
    const browser = await Browser();
    const page = await browser.newPage();
    await page.goto(UrlHelper.base + 'genres/' + req.params.endpoint);
    const content = await page.content();

    const $ = cheerio.load(content);
    const manhwaList = $('.postbody .listupd .bs');
    const manhwas = [];
    manhwaList.each((idx, el) => {
      const manhwa = { title: '', thumbnail: '', latest_chapter: '', endpoint: '' };
      manhwa.title = $(el).find('.bsx a').attr('title');
      manhwa.thumbnail = $(el).find('.bsx a .limit img').attr('src');
      manhwa.latest_chapter = $(el).find('.bsx a .bigor .adds .epxs').text();
      manhwa.endpoint = $(el)
        .find('.bsx a')
        .attr('href')
        .replace('https://manhwaindo.id/series/', '');

      manhwas.push(manhwa);
    });

    await page.close();
    await browser.close();

    res.json({
      message: 'Manhwa by Genre',
      genre: $('.postbody .bixbox .releases h1').text(),
      manhwas: manhwas,
    });
  } catch (err) {
    res.json({ message: err });
  }
});

export default router;
