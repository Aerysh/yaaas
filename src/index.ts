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
        message: 'YAAAS API Route List',
        routes: {
          '/anime': 'Anime API Provider List',
          '/manga': 'Manga API Provider List',
        },
      });
    }
  );
};

export default Server;
