import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import ManhwaindoDetails from './details';
import ManhwaindoLatest from './latest';
import ManhwaindoPopular from './popular';

const Manhwaindo = async (fastify: FastifyInstance) => {
  await fastify.register(ManhwaindoDetails, { prefix: '/details' });
  await fastify.register(ManhwaindoLatest, { prefix: '/latest' });
  await fastify.register(ManhwaindoPopular, { prefix: '/popular' });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({
      message: 'Welcome to Manhwaindo Provider, please visit them at https://manhwaindo.id',
      routes: {
        '/details/:endpoint': 'Get Manhwa Details',
        '/popular/:page': 'Get Most Popular Manhwa',
        '/latest/:page': 'Get Latest Updated Manhwa',
        '/read/:chapter-endpoint': 'Read a Manhwa Chapter',
        '/genres': 'Get All Genres',
        '/genres/:endpoint': 'Get Manhwa by Genre',
      },
    });
  });
};

export default Manhwaindo;
