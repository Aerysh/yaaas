import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import launchBrowser from '../../../utils/puppeteer';

import { SearchData } from './types';
import { AnoboyUrlHelper } from './url-helper';

const AnoboySearch = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { query: string; page: string } }>(
    '/:query/:page',
    {
      schema: {
        description: 'Search for a specific series based on a query from Anoboy',
        tags: ['Anoboy'],
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
        browser = await launchBrowser();
        page = await browser.newPage();

        const encodedQuery = encodeURIComponent(request.params.query);

        await page.goto(AnoboyUrlHelper.search(encodedQuery, parseInt(request.params.page)), {
          waitUntil: 'networkidle0',
        });

        const searchResult: SearchData[] = await page.evaluate(() => {
          const searchElements = Array.from(document.querySelectorAll('.bs'));
          let id = 0;

          return searchElements.map((searchElement) => {
            const anchor = searchElement.querySelector('a');
            const img = searchElement.querySelector('img');

            return {
              id: ++id,
              thumbnail: img?.getAttribute('src') || '',
              title: anchor?.getAttribute('title') || '',
              endpoint: anchor?.getAttribute('href') || '',
            };
          });
        });

        if (searchResult.length === 0) {
          reply.status(404).send({
            message: 'Your search returned no results. Please try a different search query.',
          });
        } else {
          reply.status(200).send({
            message: `Anoboy: Search result for ${request.params.query} page ${request.params.page}`,
            searchResult,
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

export default AnoboySearch;
