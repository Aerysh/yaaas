import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import launchBrowser from '../../../utils/puppeteer';

import { ChapterDetails, ChapterImages } from './types';
import { manhwaindoUrlHelper } from './url-helper';

const ManhwaindoRead = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { endpoint: string } }>(
    '/:endpoint',
    {
      schema: {
        description: 'Get Chapter Details From Provider',
        tags: ['ManhwaIndo'],
        params: {
          type: 'object',
          properties: {
            endpoint: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { endpoint: string } }>, reply: FastifyReply) => {
      let browser;
      let page;
      try {
        browser = await launchBrowser();
        page = await browser.newPage();

        await page.goto(manhwaindoUrlHelper.read(request.params.endpoint), {
          waitUntil: 'networkidle0',
        });

        await page.waitForSelector('img', { timeout: 3000 });

        const chapterDetails: ChapterDetails = await page.evaluate(() => {
          const chapter: ChapterDetails = {
            title: '',
            images: [],
          };

          chapter.title = document.querySelector('h1.entry-title')?.textContent || 'No title';

          const images: ChapterImages[] = [];
          document.querySelectorAll('div#readerarea img').forEach((el) => {
            const image: ChapterImages = {
              id: images.length,
              src: el.getAttribute('data-lazy-src') || el.getAttribute('src') || '',
            };
            images.push(image);
          });
          chapter.images = images;

          return chapter;
        });

        if (chapterDetails.images.length === 0) {
          reply.status(404).send({
            message: 'Result not found',
          });
        } else {
          reply.status(200).send({
            message: `ManhwaIndo: Chapter Details`,
            chapterDetails,
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

export default ManhwaindoRead;
