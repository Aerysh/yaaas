import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import ManhwaindoDetails from './details';
import ManhwaindoGenres from './genres';
import ManhwaindoLatest from './latest';
import ManhwaindoPopular from './popular';
import ManhwaindoRead from './read';
import ManhwaindoSearch from './search';
import { manhwaindoUrlHelper } from './url-helper';

const Manhwaindo = async (fastify: FastifyInstance) => {
  await fastify.register(ManhwaindoDetails, { prefix: '/details' });
  await fastify.register(ManhwaindoGenres, { prefix: '/genres' });
  await fastify.register(ManhwaindoLatest, { prefix: '/latest' });
  await fastify.register(ManhwaindoPopular, { prefix: '/popular' });
  await fastify.register(ManhwaindoRead, { prefix: '/read' });
  await fastify.register(ManhwaindoSearch, { prefix: '/search' });

  fastify.get(
    '/',
    {
      schema: {
        description: 'ManhwaIndo Provider API Routes',
        tags: ['ManhwaIndo'],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        reply.status(200).send({
          message: `Welcome to ManhwaIndo Provider! Please support them by visiting their website at ${manhwaindoUrlHelper.base}. Thank you!`,
          routes: {
            '/details/:endpoint': {
              description: 'Get details for a specific Manhwa.',
            },
            '/genres': {
              description: 'Retrieve a list of all available genre.',
            },
            '/genres/:endpoint/:page': {
              description:
                'Get a list of Manhwa filtered by a specific genre, paginated by page number.',
            },
            '/latest/:page': {
              description: 'Retrieve the latest updated Manhwa. paginated by page number.',
            },
            '/popular/:page': {
              description: 'Retrieve the most popular Manhwa, paginated by page number.',
            },
            '/read/:endpoint': {
              description: 'Read a specific chapter of a Manhwa.',
            },
            '/search/:query/:page': {
              description: 'Search for a specific Manhwa. paginated by page number.',
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

export default Manhwaindo;
