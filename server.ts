import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import Server from './src';

dotenv.config();

const PORT = process.env.PORT;

if (!PORT) {
  console.error('PORT environment variable is not defined. Exiting...');
  process.exit(1);
}

const fastify: FastifyInstance = Fastify({
  logger: true,
});

fastify.register(cors, {});

fastify.register(Server, { prefix: '/api' });

fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  reply.status(200).send({
    message: 'Welcome to Manhwaindo API',
    documentation: 'https://github.com/Aerysh/manhwaindo-api',
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: parseInt(PORT) });
    const address = fastify.server.address();

    const port = typeof address === 'string' ? address : address?.port;
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();