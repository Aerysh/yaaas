import { FastifyInstance, FastifyReply, FastifyRequest, RegisterOptions } from 'fastify';

import Manga from './routes/manga';

const Server = async (fastify: FastifyInstance, option: RegisterOptions) => {
  await fastify.register(Manga, { prefix: '/manga' });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({
      message: 'Welcome to reimagined-phone! (this is a placeholder)',
    });
  });
};

export default Server;
