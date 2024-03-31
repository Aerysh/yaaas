import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import formatEndpoint from '../../../utils/format-endpoint';
import launchBrowser from '../../../utils/puppeteer';

import { AnoboyUrlHelper } from './url-helper';

const AnoboyWatch = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { endpoint: string } }>(
    '/:endpoint',
    {
      schema: {
        description: 'Obtain streaming link for episode of a series from Anoboy',
        tags: ['Anoboy'],
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

        const response = await page.goto(`${AnoboyUrlHelper.base}${request.params.endpoint}`, {
          waitUntil: 'networkidle0',
        });

        if (response && response.status() === 404) {
          reply.status(404).send({
            message: 'The page you are looking for was not found',
          });
        } else {
          const videoSource = await page.evaluate(() => {
            const video = document.querySelector('iframe');
            return video ? video.getAttribute('src') : null;
          });

          reply.status(200).send({
            message: `Anoboy: `,
            data: {
              title: formatEndpoint(request.params.endpoint),
              videoSource,
            },
          });
        }
      } catch (error) {
        reply.status(500).send({
          message: 'Internal server error',
          error,
        });
      } finally {
        if (page) await page.close().catch(console.error);
        if (browser) await browser.close().catch(console.error);
      }
    }
  );
};

export default AnoboyWatch;
