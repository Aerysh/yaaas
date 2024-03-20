import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import launchBrowser from '../../../utils/puppeteer';

import { Manhwa } from './types';
import { manhwaindoUrlHelper } from './url-helper';

const ManhwaindoLatest = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { page: string } }>(
    '/:page',
    {
      schema: {
        description: 'Get Latest Updated Series From Provider',
        tags: ['ManhwaIndo'],
        params: {
          type: 'object',
          properties: {
            page: { type: 'number' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { page: string } }>, reply: FastifyReply) => {
      let browser;
      let page;
      try {
        browser = await launchBrowser();
        page = await browser.newPage();

        const pageNumber = parseInt(request.params.page, 10);
        if (isNaN(pageNumber) || pageNumber <= 0) {
          return reply.status(400).send({
            message: 'Invalid page number',
          });
        }

        await page.goto(manhwaindoUrlHelper.latest(pageNumber), {
          waitUntil: 'networkidle0',
        });

        await page.waitForSelector('img', { timeout: 3000 });

        const manhwas: Manhwa[] = await page.evaluate(() => {
          const manhwaList = Array.from(
            document.querySelectorAll('.postbody .bixbox .mrgn .listupd .bs')
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
            message: `ManhwaIndo: Latest Updated Series Page ${pageNumber}`,
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

export default ManhwaindoLatest;
