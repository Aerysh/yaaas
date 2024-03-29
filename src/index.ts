import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import Anime from './routes/anime';
import Manga from './routes/manga';

const Server = async (fastify: FastifyInstance) => {
  await fastify.register(Anime, { prefix: '/anime' });
  await fastify.register(Manga, { prefix: '/manga' });

  fastify.get(
    '/',
    {
      schema: {
        description: 'API Route List',
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.status(200).send({
        message: 'Welcome to YAAAS API Route List',
        routes: {
          '/anime': 'List of Anime API Providers',
          '/manga': 'List of Manga API Providers',
        },
      });
    }
  );
};

export default Server;
