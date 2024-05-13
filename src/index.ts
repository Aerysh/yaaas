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
        message: 'Welcome to Yet Another API for Anime and Stuff!',
        routes: [
          { name: 'Documentation', path: '/documentation' },
          { name: 'Anime', path: '/api/anime' },
          { name: 'Manga', path: '/api/manga' },
        ],
      });
    }
  );
};

export default Server;
