import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import launchBrowser from '../../../utils/puppeteer';

import { Manhwa } from './types';
import { manhwaindoUrlHelper } from './url-helper';

const ManhwaindoSearch = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { query: string; page: string } }>(
    '/:query/:page',
    {
      schema: {
        description: 'Search for a specific Manhwa. paginated by page number.',
        tags: ['ManhwaIndo'],
        params: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            page: { type: 'string' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { query: string; page: string } }>,
      reply: FastifyReply
    ) => {
      let browser;
      let page;
      try {
        const encodedQuery = encodeURIComponent(request.params.query);

        browser = await launchBrowser();
        page = await browser.newPage();

        await page.goto(manhwaindoUrlHelper.search(encodedQuery, parseInt(request.params.page)), {
          waitUntil: 'networkidle0',
        });

        await page.waitForSelector('img', { timeout: 3000 });

        const manhwas: Manhwa[] = await page.evaluate(() => {
          const manhwaList = Array.from(
            document.querySelectorAll('.postbody .bixbox .listupd .bs')
          );
          return manhwaList.map((el) => {
            const title = el.querySelector('.bsx a')?.getAttribute('title') || '';
            const thumbnail =
              el.querySelector('.bsx a .limit img')?.getAttribute('data-lazy-src') ||
              el.querySelector('.bsx a .limit img')?.getAttribute('src') ||
              '';
            const latestChapter = el.querySelector('.bsx a .bigor .adds .epxs')?.textContent || '';
            let endpoint = el.querySelector('.bsx a')?.getAttribute('href') || '';
            endpoint = endpoint
              .replace('https://manhwaindo.id/series/', '')
              .replace('https://manhwaindo.net/series/', '')
              .replace('/', '');
            return { title, thumbnail, latestChapter, endpoint };
          });
        });

        if (manhwas.length === 0) {
          reply.status(404).send({
            message: 'Result not found',
          });
        } else {
          reply.status(200).send({
            message: `ManhwaIndo: Search Result for ${request.params.query}`,
            manhwas,
          });
        }
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

export default ManhwaindoSearch;
