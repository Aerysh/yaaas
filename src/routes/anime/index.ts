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
      reply.status(200).send({
        message: 'Welcome to Anime API, select provider by visiting them by their routes',
        routes: {
          '/kusonime': 'Kusonime Provider',
        },
      });
    }
  );
};

export default Anime;
