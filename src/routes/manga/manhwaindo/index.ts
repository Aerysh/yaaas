import { FastifyInstance, FastifyReply, FastifyRequest, RegisterOptions } from 'fastify';
import ManhwaindoPopular from './popular';

const Manhwaindo = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(ManhwaindoPopular, { prefix: '/popular' });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({
      message: 'Welcome to Manhwaindo Provider, please visit them at https://manhwaindo.id',
      routes: {
        '/popular/:page': 'Get Most Popular Manhwa',
        '/latest/:page': 'Get Latest Updated Manhwa',
        '/detail/:endpoint': 'Get Manhwa Details',
        '/read/:chapter-endpoint': 'Read a Manhwa Chapter',
        '/genres': 'Get All Genres',
        '/genres/:endpoint': 'Get Manhwa by Genre',
      },
    });
  });
};

export default Manhwaindo;
