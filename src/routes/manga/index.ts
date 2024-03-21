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
        message: 'Welcome to Manga API, select provider by visiting them by their routes',
        routes: {
          '/manhwaindo': 'Manhwaindo.id Provider',
        },
      });
    }
  );
};

export default Manga;
