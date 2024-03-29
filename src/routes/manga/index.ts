import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import Manhwaindo from './manhwaindo';

const Manga = async (fastify: FastifyInstance) => {
  await fastify.register(Manhwaindo, { prefix: '/manhwaindo' });

  fastify.get(
    '/',
    {
      schema: {
        description: 'Get Manga API Provider List',
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.status(200).send({
        message:
          'Welcome to YAAAS Manga API! Please visit the corresponding routes for each provider',
        routes: {
          '/manhwaindo': {
            name: 'ManhwaIndo',
            description:
              'Search for Manhwa, view genre lists, filter by genre, and read individual chapters',
          },
        },
      });
    }
  );
};

export default Manga;
