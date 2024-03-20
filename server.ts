import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import dotenv from 'dotenv';
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

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

fastify.register(swagger, {});
fastify.register(swaggerUi, {});

fastify.register(Server, { prefix: '/api' });

fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  reply.status(200).send({
    message: 'Welcome to reimagined-phone! (this is a placeholder)',
    routes: {
      '/api': 'API Routes List',
    },
    repository: 'https://github.com/Aerysh/manhwaindo-api',
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: parseInt(PORT) });
    fastify.swagger();
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Access Swagger-UI at http://localhost:${PORT}/documentation`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
