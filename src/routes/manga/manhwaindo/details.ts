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

        const manhwaDetail: ManhwaDetails = await page.evaluate(() => {
          const manhwa: ManhwaDetails = {
            thumbnail: '',
            title: '',
            altTitle: '',
            genres: [],
            synopsis: '',
            chapters: [],
          };

          manhwa.thumbnail =
            document.querySelector('.thumb img')?.getAttribute('data-lazy-src') ||
            document.querySelector('.thumb img')?.getAttribute('src') ||
            '';
          manhwa.title = document.querySelector('h1.entry-title')?.textContent || 'No title';
          manhwa.altTitle = document.querySelector('.alternative')?.textContent || '';

          const genres: Genre[] = [];
          document.querySelectorAll('.mgen a').forEach((genreElement) => {
            const genre: Genre = {
              name: genreElement.textContent || 'No genre',
              endpoint:
                genreElement
                  .getAttribute('href')
                  ?.replace('https://manhwaindo.net/genres/', '')
                  ?.replace('https://manhwaindo.id/genres/', '')
                  ?.replace('/', '') || '',
            };
            genres.push(genre);
          });
          manhwa.genres = genres;

          manhwa.synopsis =
            document.querySelector('.entry-content[itemprop=description]')?.textContent ||
            'No synopsis';

          const chapters: Chapter[] = [];
          document.querySelectorAll('div.bxcl li').forEach((chapterElement) => {
            const chapter: Chapter = {
              name: chapterElement.querySelector('a .chapternum')?.textContent || 'No chapter name',
              date:
                chapterElement.querySelector('a .chapterdate')?.textContent || 'No chapter date',
              endpoint: chapterElement.querySelector('a')?.getAttribute('href') || '',
            };
            chapter.date = new Date(
              chapter.date.replace(/(\d{1,2})\s([A-Za-z]{3})\s(\d{4})/, '$3-$1-$2')
            )
              .toISOString()
              .split('T')[0];
            chapter.endpoint = chapter.endpoint
              .replace('https://manhwaindo.id/', '')
              .replace('https://manhwaindo.net/', '')
              .replace('/', '');
            chapters.push(chapter);
          });
          manhwa.chapters = chapters;

          return manhwa;
        });

        reply.status(200).send({
          message: `ManhwaIndo: ${manhwaDetail.title} Details`,
          manhwaDetail,
        });
      } catch (error) {
        reply.status(500).send({
          message: 'Internal Server Error',
          error,
        });
      } finally {
        if (page) {
          await page.close().catch(console.error);
        }
        if (browser) {
          await browser.close().catch(console.error);
        }
      }
    }
  );
};

export default ManhwaindoDetails;
