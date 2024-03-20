import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import launchBrowser from '../../../utils/puppeteer';

import { Genre, Manhwa } from './types';
import { manhwaindoUrlHelper } from './url-helper';

const ManhwaindoGenres = async (fastify: FastifyInstance) => {
  fastify.get(
    '/',
    {
      schema: {
        description: 'Get Genre List From Provider',
        tags: ['ManhwaIndo'],
      },
    },
    async (request, reply) => {
      let browser;
      let page;
      try {
        browser = await launchBrowser();
        page = await browser.newPage();

        await page.goto(manhwaindoUrlHelper.base, {
          waitUntil: 'networkidle0',
        });

        const genres: Genre[] = await page.evaluate(() => {
          const genreList = Array.from(document.querySelectorAll('ul.genre li'));

          return genreList.map((el) => {
            const genre = {
              name: el.querySelector('a')?.textContent || '',
              endpoint:
                el
                  .querySelector('a')
                  ?.getAttribute('href')
                  ?.replace('https://manhwaindo.id/genres/', '')
                  ?.replace('https://manhwaindo.net/genres/', '')
                  ?.replace('/', '') || '',
            };
            return genre;
          });
        });

        reply.status(200).send({
          message: 'Manhwaindo: Genre List',
          genres,
        });
      } catch (error) {
        reply.status(500).send({
          message: 'Internal Server Error',
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

  fastify.get<{ Params: { endpoint: string; page: string } }>(
    '/:endpoint/:page',
    {
      schema: {
        description: 'Get Series List by Genre From Provider',
        tags: ['ManhwaIndo'],
        params: {
          type: 'object',
          properties: {
            endpoint: { type: 'string' },
            page: { type: 'number' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { endpoint: string; page: string } }>,
      reply: FastifyReply
    ) => {
      let browser;
      let page;
      try {
        browser = await launchBrowser();
        page = await browser.newPage();

        await page.goto(
          manhwaindoUrlHelper.genres(request.params.endpoint, parseInt(request.params.page)),
          {
            waitUntil: 'networkidle0',
          }
        );

        await page.waitForSelector('img', { timeout: 3000 });

        const manhwas: Manhwa[] = await page.evaluate(() => {
          const manhwaList = Array.from(
            document.querySelectorAll('.postbody .bixbox .listupd .bs')
          );

          return manhwaList.map((el) => {
            const manhwa: Manhwa = {
              title: '',
              thumbnail: '',
              latestChapter: '',
              endpoint: '',
            };
            manhwa.title = el.querySelector('.bsx a')?.getAttribute('title') || '';
            manhwa.thumbnail =
              el.querySelector('.bsx a .limit img')?.getAttribute('data-lazy-src') ||
              el.querySelector('.bsx a .limit img')?.getAttribute('src') ||
              '';
            manhwa.latestChapter = el.querySelector('.bsx a .bigor .adds .epxs')?.textContent || '';
            manhwa.endpoint = el.querySelector('.bsx a')?.getAttribute('href') || '';
            manhwa.endpoint =
              manhwa.endpoint
                ?.replace('https://manhwaindo.net/series/', '')
                .replace('https://manhwaindo.id/series/', '')
                .replace('/', '') || '';

            return manhwa;
          });
        });

        if (manhwas.length === 0) {
          reply.status(404).send({
            message: 'Result not found',
          });
        } else {
          reply.status(200).send({
            message: `ManhwaIndo: Series With ${request.params.endpoint} Genre Page ${request.params.page}`,
            manhwas,
          });
        }
      } catch (error) {
        reply.status(500).send({
          message: 'Internal Server Error',
        });
      }
    }
  );
};

export default ManhwaindoGenres;
