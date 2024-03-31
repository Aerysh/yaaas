import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import AnoboyInfo from './info';
import AnoboySearch from './search';
import { AnoboyUrlHelper } from './url-helper';
import AnoboyWatch from './watch';

const Anoboy = async (fastify: FastifyInstance) => {
  await fastify.register(AnoboyInfo, { prefix: '/info' });
  await fastify.register(AnoboySearch, { prefix: '/search' });
  await fastify.register(AnoboyWatch, { prefix: '/watch' });

  fastify.get(
    '/',
    {
      schema: {
        description: 'Provides a clear overview of the available API routes for Anoboy Provider',
        tags: ['Anoboy'],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        reply.status(200).send({
          message: `Welcome to Anoboy API! Please visit them at ${AnoboyUrlHelper.base}`,
          routes: {
            '/search/:query/:page': 'Search for a specific series based on a query',
          },
        });
      } catch (error) {
        reply.status(500).send({
          message: 'Internal server error',
          error,
        });
      }
    }
  );
};

export default Anoboy;
