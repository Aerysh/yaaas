import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import launchBrowser from '../../../utils/puppeteer';

import KusonimeUrlHelper from './url-helper';

type Provider = {
  title: string;
  url: string;
};

type Link = {
  resolution: string;
  providers: Provider[];
};

type EpisodeGroup = {
  title: string;
  links: Link[];
};

const KusonimeWatch = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { endpoint: string } }>(
    '/:endpoint',
    {
      schema: {
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

        const links = await page.evaluate(() => {
          const dlDivs = document.querySelectorAll('.smokeddlrh');
          const linkGroups: EpisodeGroup[] = [];

          dlDivs.forEach((dlDiv) => {
            const title = (dlDiv.querySelector('.smokettlrh') as HTMLElement)?.textContent || '';
            const linksDivs = dlDiv.querySelectorAll('.smokeurlrh');
            const linksArray: Link[] = [];

            linksDivs.forEach((linksDiv) => {
              const resolutionMatch = (linksDiv.textContent || '').match(/(\d+)(p)?/);
              const resolution = resolutionMatch
                ? `${resolutionMatch[1]}${resolutionMatch[2] || ''}`
                : '';
              const links = Array.from(linksDiv.querySelectorAll('a'))
                .map((a) => ({
                  title: (a as HTMLAnchorElement).textContent || '',
                  url: (a as HTMLAnchorElement).href || '',
                }))
                .filter(Boolean) as Provider[];

              linksArray.push({ resolution, providers: links });
            });

            linkGroups.push({ title, links: linksArray });
          });

          return linkGroups;
        });

        if (links.length === 0) {
          reply.status(404).send({
            message: `The page you're looking for does not exist!`,
          });
          return;
        }

        reply.status(200).send(links);
      } catch (error) {
        reply.status(500).send({});
      } finally {
        if (browser) {
          await browser.close().catch(console.error);
        }
      }
    }
  );
};

export default KusonimeWatch;
