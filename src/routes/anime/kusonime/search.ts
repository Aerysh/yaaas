import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import launchBrowser from '../../../utils/puppeteer';

import KusonimeUrlHelper from './url-helper';

const KusonimeSearch = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { query: string; page: number } }>(
    '/:query/:page',
    {
      schema: {
        tags: ['Kusonime'],
        params: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            page: { type: 'number', default: 1 },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { query: string; page: number } }>,
      reply: FastifyReply
    ) => {
      let browser;
      let page;
      try {
        browser = await launchBrowser();
        page = await browser.newPage();

        const query = encodeURIComponent(request.params.query);
        const pageNumber = request.params.page || 1;

        await page.goto(KusonimeUrlHelper.search(query, pageNumber), {
          waitUntil: 'networkidle0',
        });

        const searchResult = await page.evaluate(() => {
          const list = Array.from(document.querySelectorAll('div.rseries div.rapi div.kover'));

          return list.map((el) => {
            const id = el.querySelector('a')?.getAttribute('href')?.split('/')[3];
            const title = el.querySelector('h2.episodeye')?.textContent || '';
            const thumbnail = el.querySelector('div.thumbz img')?.getAttribute('src') || '';
            const url = el.querySelector('a')?.getAttribute('href');

            return {
              id,
              title,
              thumbnail,
              url,
            };
          });
        });

        if (searchResult.length === 0) {
          reply.status(404).send({
            message: `No results found for the query "${request.params.query}"`,
          });
          return;
        }

        reply.status(200).send(searchResult);
      } catch (error) {
        reply.status(500).send({
          message: 'Internal Server Error',
          error,
        });
      } finally {
        if (browser) {
          await browser.close().catch(console.error);
        }
      }
    }
  );
};

export default KusonimeSearch;
