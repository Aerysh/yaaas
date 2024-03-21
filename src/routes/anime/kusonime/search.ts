import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import launchBrowser from '../../../utils/puppeteer';

import { KusonimeSearchResult } from './types';
import { KusonimeUrlHelper } from './url-helper';

const KusonimeSearch = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { query: string; page: string } }>(
    '/:query/:page',
    {
      schema: {
        description: 'Provide Search Result for Kusonime Provider',
        tags: ['Kusonime'],
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

        await page.goto(KusonimeUrlHelper.search(encodedQuery, parseInt(request.params.page)), {
          waitUntil: 'networkidle0',
        });

        const searchResults: KusonimeSearchResult[] = await page.evaluate(() => {
          const list = Array.from(document.querySelectorAll('div.rseries div.rapi div.kover'));

          return list.map((el) => {
            const id = list.indexOf(el) + 1;
            const title = el.querySelector('h2.episodeye')?.textContent || '';
            const thumbnail = el.querySelector('div.thumbz img')?.getAttribute('src') || '';
            const endpoint =
              el
                .querySelector('a')
                ?.getAttribute('href')
                ?.replace('https://kusonime.com/', '')
                .replace('/', '') || '';

            return {
              id,
              title,
              thumbnail,
              endpoint,
            };
          });
        });

        if (searchResults.length === 0) {
          reply.status(404).send({
            message: 'Result not found',
          });
        } else {
          reply.status(200).send({
            message: `Kusonime: Search Result for ${request.params.query} Page ${request.params.page}`,
            searchResults,
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

export default KusonimeSearch;
