import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import Manhwaindo from './manhwaindo';

const Manga = async (fastify: FastifyInstance) => {
  await fastify.register(Manhwaindo, { prefix: '/manhwaindo' });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({
      message: 'Welcome to YAAAS Manga API!',
      providers: [{ name: 'ManhwaIndo', path: '/manhwaindo' }],
    });
  });
};

export default Manga;
