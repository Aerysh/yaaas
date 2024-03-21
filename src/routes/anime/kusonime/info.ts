import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import formatEndpoint from '../../../utils/format-endpoint';
import launchBrowser from '../../../utils/puppeteer';

import { KusonimeUrlHelper } from './url-helper';

const KusonimeInfo = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { endpoint: string } }>(
    '/:endpoint',
    {
      schema: {
        description: 'Provide Details for a Series From Kusonime',
        tags: ['Kusonime'],
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

        await page.goto(KusonimeUrlHelper.info(request.params.endpoint), {
          waitUntil: 'networkidle0',
        });

        const thumbnail = await page.$eval(
          'img[class*="attachment-thumb-large size-thumb-large wp-post-image"]',
          (el) => el.getAttribute('src') ?? ''
        );
        const title = await page.$eval('h1[class*="jdlz"]', (el) => el.textContent?.trim() ?? '');

        const info = await page.$eval('.info', (el) => {
          const pTags = Array.from(el.querySelectorAll('p'));
          const info: Record<string, string | null> = {};

          pTags.forEach((p) => {
            const bTag = p.querySelector('b');
            const key = bTag?.textContent?.trim() ?? '';
            const value =
              p.textContent
                ?.replace(bTag?.textContent ?? '', '')
                ?.trim()
                ?.replace(': ', '') ?? null;
            info[key] = value;
          });

          return info;
        });

        const data = {
          thumbnail,
          title,
          alternativeTitle: info['Japanese'] ?? null,
          type: info['Type'] ?? null,
          status: info['Status'] ?? null,
          totalEpisodes: info['Total Episode'] ?? null,
          releaseDate: info['Released on'] ?? null,
          endpoint: request.params.endpoint,
        };

        reply.status(200).send({
          message: `Kusonime: Info for ${formatEndpoint(request.params.endpoint)}`,
          data,
        });
      } catch (error) {
        reply.status(500).send({
          message: 'Internal Server Error',
          error,
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

export default KusonimeInfo;
