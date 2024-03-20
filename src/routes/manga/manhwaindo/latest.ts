import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import launchBrowser from '../../../utils/puppeteer';

import { Manhwa } from './types';
import { manhwaindoUrlHelper } from './url-helper';

const ManhwaindoLatest = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { page: string } }>(
    '/:page',
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

        await page.waitForSelector('img');

        const manhwas: Manhwa[] = await page.evaluate(() => {
          const manhwaList = Array.from(
            document.querySelectorAll('.postbody .bixbox .mrgn .listupd .bs')
          );
          return manhwaList.map((el) => {
            const manhwa: Manhwa = {
              title: el.querySelector('.bsx a')?.getAttribute('title') || '',
              thumbnail:
                el.querySelector('.bsx a .limit img')?.getAttribute('data-lazy-src') ||
                el.querySelector('.bsx a .limit img')?.getAttribute('src') ||
                '',
              latest_chapter: el.querySelector('.bsx a .bigor .adds .epxs')?.textContent || '',
              endpoint: el.querySelector('.bsx a')?.getAttribute('href') || '',
            };
            manhwa.endpoint = manhwa.endpoint
              .replace('https://manhwaindo.id/', '')
              .replace('https://manhwaindo.net/', '')
              .replace('/', '');
            return manhwa;
          });
        });

        reply.status(200).send({
          message: `ManhwaIndo: Latest Updated Series Page ${pageNumber}`,
          manhwas,
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

export default ManhwaindoLatest;
