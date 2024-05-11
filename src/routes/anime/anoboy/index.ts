import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import AnoboyInfo from './info';
import AnoboySearch from './search';
import AnoboyUrlHelper from './url-helper';
import AnoboyWatch from './watch';

const Anoboy = async (fastify: FastifyInstance) => {
  await fastify.register(AnoboyInfo, { prefix: '/info' });
  await fastify.register(AnoboySearch, { prefix: '/search' });
  await fastify.register(AnoboyWatch, { prefix: '/watch' });

  fastify.get(
    '/',
    {
      schema: {
        description: '',
        tags: ['Anoboy'],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.status(200).send({
        message: `Welcome to Anoboy API! Please visit them at ${AnoboyUrlHelper.base}`,
        routes: ['/search/:query', '/info/:endpoint', '/watch/:endpoint'],
      });
    }
  );
};

export default Anoboy;
