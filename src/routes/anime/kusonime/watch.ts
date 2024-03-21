import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import formatEndpoint from '../../../utils/format-endpoint';
import launchBrowser from '../../../utils/puppeteer';

import { KusonimeUrlHelper } from './url-helper';

const KusonimeWatch = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { endpoint: string } }>(
    '/:endpoint',
    {
      schema: {
        description: 'Provide Download Links for a Series From Kusonime',
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

        const smokeddlrhDivs = await page.$$('.smokeddlrh');
        const downloadLinks = [];

        for (const smokeddlrhDiv of smokeddlrhDivs) {
          const title = await page.evaluate(
            (el) => el.querySelector('.smokettlrh')?.textContent,
            smokeddlrhDiv
          );

          const smokeurlrhDivs = await smokeddlrhDiv.$$('.smokeurlrh');
          const links = [];

          for (const smokeurlrhDiv of smokeurlrhDivs) {
            const quality = await page.evaluate(
              (el) => el.querySelector('strong')?.textContent,
              smokeurlrhDiv
            );

            const qualityLinks = await page.evaluate((el) => {
              const anchorTags = Array.from(el.querySelectorAll('a'));
              return anchorTags.map((a) => ({
                title: a.textContent?.trim(),
                url: a.href,
              }));
            }, smokeurlrhDiv);

            links.push({
              quality,
              links: qualityLinks,
            });
          }

          downloadLinks.push({
            title,
            links,
          });
        }

        if (downloadLinks.length === 0) {
          return reply.status(404).send({
            message: 'No download links found',
          });
        } else {
          return reply.status(200).send({
            message: `Kusonime: ${formatEndpoint(request.params.endpoint)} Download Links`,
            links: downloadLinks,
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

export default KusonimeWatch;
