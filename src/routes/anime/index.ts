import { FastifyInstance } from 'fastify';

import Anoboy from './anoboy';
import Kusonime from './kusonime';

const Anime = async (fastify: FastifyInstance) => {
  await fastify.register(Anoboy, { prefix: '/anoboy' });
  await fastify.register(Kusonime, { prefix: '/kusonime' });

  fastify.get('/', async (request, reply) => {
    reply.status(200).send({
      message: 'Welcome to YAAAS Anime API',
      providers: [
        { name: 'Anoboy', path: '/anoboy' },
        { name: 'Kusonime', path: '/kusonime' },
      ],
    });
  });
};

export default Anime;
