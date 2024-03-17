import { FastifyInstance, FastifyReply, FastifyRequest, RegisterOptions } from 'fastify';

const Manhwaindo = async (fastify: FastifyInstance, options: RegisterOptions) => {
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
