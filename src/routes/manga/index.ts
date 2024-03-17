import { FastifyInstance, RegisterOptions } from 'fastify';
import Manhwaindo from './manhwaindo';

const Manga = async (fastify: FastifyInstance, option: RegisterOptions) => {
  await fastify.register(Manhwaindo, { prefix: '/manhwaindo' });

  fastify.get('/', async (request: any, reply: any) => {
    return { hello: 'world' };
  });
};

export default Manga;
