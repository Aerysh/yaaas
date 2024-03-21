import { FastifyInstance } from 'fastify';

import KusonimeInfo from './info';
import KusonimeSearch from './search';
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
    async (request, reply) => {
      try {
        reply.status(200).send({
          message: 'Welcome to Kusonime API, please visit them at https://kusonime.com/',
          routes: {
            '/search/:query/:page': 'Search Anime Series From Kusonime',
            '/watch/:endpoint': 'Get Download Links for a Series From Kusonime',
          },
        });
      } catch (error) {
        reply.status(500).send({
          message: 'Internal Server Error',
          error,
        });
      }
    }
  );
};

export default Kusonime;
