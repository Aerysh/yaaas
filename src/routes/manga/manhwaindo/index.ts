import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import ManhwaindoDetails from './details';
import ManhwaindoGenres from './genres';
import ManhwaindoLatest from './latest';
import ManhwaindoPopular from './popular';
import ManhwaindoRead from './read';

const Manhwaindo = async (fastify: FastifyInstance) => {
  await fastify.register(ManhwaindoDetails, { prefix: '/details' });
  await fastify.register(ManhwaindoGenres, { prefix: '/genres' });
  await fastify.register(ManhwaindoLatest, { prefix: '/latest' });
  await fastify.register(ManhwaindoPopular, { prefix: '/popular' });
  await fastify.register(ManhwaindoRead, { prefix: '/read' });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({
      message: 'Welcome to ManhwaIndo Provider, please visit them at https://manhwaindo.net/',
      routes: {
        '/details/:endpoint': 'Get Manhwa Details',
        '/genres': 'Get All Genres',
        '/genres/:endpoint': 'Get Manhwa by Genre',
        '/latest/:page': 'Get Latest Updated Manhwa',
        '/popular/:page': 'Get Most Popular Manhwa',
        '/read/:endpoint': 'Read a Manhwa Chapter',
      },
    });
  });
};

export default Manhwaindo;
