import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import KusonimeInfo from './info';
import KusonimeSearch from './search';
import { KusonimeUrlHelper } from './url-helper';
import KusonimeWatch from './watch';

const Kusonime = async (fastify: FastifyInstance) => {
  await fastify.register(KusonimeInfo, { prefix: '/info' });
  await fastify.register(KusonimeSearch, { prefix: '/search' });
  await fastify.register(KusonimeWatch, { prefix: '/watch' });

  fastify.get(
    '/',
    {
      schema: {
        description: 'Provide Kusonime Provider API Route List',
        tags: ['Kusonime'],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        reply.status(200).send({
          message: `Welcome to Kusonime Provider! Please support them by visiting their website at ${KusonimeUrlHelper.base}. Thank you!`,
          routes: {
            '/info/:endpoint': {
              description: 'Retrieve the information for a specific series',
            },
            '/search/:query/:page': {
              descriptiion: 'Search for a series, paginated by number',
            },
            '/watch/:endpoint': {
              description: 'Retrieve the download links for a specific series',
            },
          },
        });
      } catch (error) {
        reply.status(500).send({
          message: 'An unexpected error occurred on the server.',
          error,
        });
      }
    }
  );
};

export default Kusonime;
