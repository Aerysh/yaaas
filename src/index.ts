import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import Anime from './routes/anime';
import Manga from './routes/manga';

const Server = async (fastify: FastifyInstance) => {
  await fastify.register(Anime, { prefix: '/anime' });
  await fastify.register(Manga, { prefix: '/manga' });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({
      message: 'Welcome to reimagined-phone! (this is a placeholder)',
      routes: {
        '/manga': 'Manga API Provider List',
      },
    });
  });
};

export default Server;
