import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import launchBrowser from '../../../utils/puppeteer';

import { Chapter, Genre, ManhwaDetails } from './types';
import { manhwaindoUrlHelper } from './url-helper';

const ManhwaindoDetails = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { endpoint: string } }>(
    '/:endpoint',
    async (request: FastifyRequest<{ Params: { endpoint: string } }>, reply: FastifyReply) => {
      let browser;
      let page;
      try {
        browser = await launchBrowser();
        page = await browser.newPage();

        await page.goto(manhwaindoUrlHelper.detail(request.params.endpoint), {
          waitUntil: 'networkidle0',
        });

        await page.waitForSelector('img');

        const manhwaDetail: ManhwaDetails = await page.evaluate(
          (manhwa: ManhwaDetails) => {
            manhwa.thumbnail = document.querySelector('.thumb img')?.getAttribute('src') ?? '';

            manhwa.title = document.querySelector('h1.entry-title')?.textContent ?? 'No title';

            manhwa.altTitle = document.querySelector('.alternative')?.textContent || '';

            const genres: Genre[] = [];
            document.querySelectorAll('.mgen a').forEach((genreElement) => {
              const genre = { name: '', endpoint: '' };
              genre.name = genreElement.textContent ?? 'No genre';
              genre.endpoint = genreElement.getAttribute('href') ?? '';
              genres.push(genre);
            });
            manhwa.genres = genres;

            manhwa.synopsis =
              document.querySelector('.entry-content[itemprop=description]')?.textContent ??
              'No synopsis';

            const chapters: Chapter[] = [];
            document.querySelectorAll('div.bxcl li').forEach((chapterElement) => {
              const chapter = { name: '', date: '', endpoint: '' };

              chapter.name =
                chapterElement.querySelector('a .chapternum')?.textContent ?? 'No chapter name';
              chapter.date =
                chapterElement.querySelector('a .chapterdate')?.textContent ?? 'No chapter date';
              chapter.date = new Date(
                chapter.date.replace(/(\d{1,2})\s([A-Za-z]{3})\s(\d{4})/, '$3-$1-$2')
              )
                .toISOString()
                .split('T')[0];
              chapter.endpoint =
                chapterElement
                  .querySelector('a')
                  ?.getAttribute('href')
                  ?.replace('https://manhwaindo.id/', '')
                  .replace('/', '') ?? '';
              chapters.push(chapter);
            });
            manhwa.chapters = chapters;

            return manhwa;
          },
          { thumbnail: '', title: '', altTitle: '', genres: [], synopsis: '', chapters: [] }
        );

        reply.status(200).send({
          message: `Manhwa Details`,
          manhwaDetail,
        });
      } catch (error) {
        reply.status(500).send({
          message: 'Internal Server Error',
        });
      } finally {
        if (page) {
          await page.close();
        }
        if (browser) {
          await browser.close();
        }
      }
    }
  );
};

export default ManhwaindoDetails;
