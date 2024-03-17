import { FastifyInstance, FastifyReply, FastifyRequest, RegisterOptions } from 'fastify';

import Manhwaindo from './manhwaindo';

const Manga = async (fastify: FastifyInstance, option: RegisterOptions) => {
  await fastify.register(Manhwaindo, { prefix: '/manhwaindo' });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({
      message: 'Welcome to Manga API, select provider by visiting them by their routes',
      routes: {
        '/manhwaindo': 'Manhwaindo.id Provider',
      },
    });
  });
};

export default Manga;
