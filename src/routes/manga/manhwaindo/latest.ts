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

        await page.goto(manhwaindoUrlHelper.latest(parseInt(request.params.page)), {
          waitUntil: 'networkidle0',
        });

        await page.waitForSelector('img');

        const manhwas: Manhwa[] = await page.evaluate(() => {
          const manhwaList = Array.from(
            document.querySelectorAll('.postbody .bixbox .mrgn .listupd .bs')
          );
          return manhwaList.map((el) => {
            const manhwa: Manhwa = {
              title: '',
              thumbnail: '',
              latest_chapter: '',
              endpoint: '',
            };
            manhwa.title = el.querySelector('.bsx a')?.getAttribute('title') || '';
            manhwa.thumbnail = el.querySelector('.bsx a .limit img')?.getAttribute('src') || '';
            manhwa.latest_chapter =
              el.querySelector('.bsx a .bigor .adds .epxs')?.textContent || '';
            manhwa.endpoint = el.querySelector('.bsx a')?.getAttribute('href') || '';
            manhwa.endpoint = manhwa.endpoint?.replace('https://manhwaindo.id/series/', '') || '';
            manhwa.endpoint = manhwa.endpoint?.replace('/', '');

            return manhwa;
          });
        });

        reply.status(200).send({
          message: `Manhwaindo Latest Updated List Page ${request.params.page}`,
          manhwas,
        });
      } catch (error) {
        reply.status(500).send({
          message: error,
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

export default ManhwaindoLatest;
