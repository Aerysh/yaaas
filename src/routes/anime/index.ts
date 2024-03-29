import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import Kusonime from './kusonime';

const Anime = async (fastify: FastifyInstance) => {
  await fastify.register(Kusonime, { prefix: '/kusonime' });

  fastify.get(
    '/',
    {
      schema: {
        description: 'Get Anime API Provider List',
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        reply.status(200).send({
          message:
            'Welcome to YAAAS Anime API! Please visit the corresponding routes for each provider',
          routes: {
            '/kusonime': {
              name: 'Kusonime',
              description:
                'Search for anime series, view series information, and get download links',
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

export default Anime;
