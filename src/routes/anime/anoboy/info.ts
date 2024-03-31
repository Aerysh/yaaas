import { FastifyReply, FastifyRequest } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

import formatEndpoint from '../../../utils/format-endpoint';
import launchBrowser from '../../../utils/puppeteer';

import { AnoboyUrlHelper } from './url-helper';

interface AdditionalInfo {
  [key: string]: string;
}

const AnoboyInfo = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { endpoint: string } }>(
    '/:endpoint',
    {
      schema: {
        description: 'Retrieve detailed information about a specific series from Anoboy',
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

        const response = await page.goto(AnoboyUrlHelper.info(request.params.endpoint), {
          waitUntil: 'networkidle0',
        });

        if (response && response.status() === 404) {
          reply.status(404).send({
            message: 'The page you are looking for was not found',
          });
        } else {
          const infoData = {
            thumbnail: await page.$eval('.thumb img', (img) => img.getAttribute('src')),
            title: await page.$eval('.entry-title', (el) => el.textContent),
            alternativeTitle: await page.$eval('.alter', (el) => el.textContent),
            synopsis: await page.$eval('.entry-content', (el) => el.textContent),
            additionalInfo: {} as AdditionalInfo,
            endpoint: await page.evaluate(() =>
              window.location.href.replace('https://anoboy.ch/anime/', '').replace('/', '')
            ),
          };

          const additionalInfoSpans = await page.$$eval('.info-content span', (spans) =>
            spans.map((span) => span.textContent)
          );
          for (const span of additionalInfoSpans) {
            if (span) {
              const [key, value] = span.split(':').map((part) => part.trim());
              if (key && value) {
                infoData.additionalInfo[key] = value;
              }
            }
          }

          if (JSON.stringify(infoData) === '{}') {
            reply.status(400).send({
              message: 'Requested information is not available',
            });
          } else {
            reply.status(200).send({
              message: `Anoboy: Information for ${formatEndpoint(request.params.endpoint)}`,
              infoData,
            });
          }
        }
      } catch (error) {
        reply.status(500).send({
          message: 'Internal Server Error',
          error,
        });
      } finally {
        if (page) await page.close().catch(console.error);
        if (browser) await browser.close().catch(console.error);
      }
    }
  );
};

export default AnoboyInfo;
