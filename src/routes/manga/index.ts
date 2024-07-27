import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import Komikindo from './komikindo';
import Manhwaindo from './manhwaindo';

const Manga = async (fastify: FastifyInstance) => {
	await fastify.register(Komikindo, { prefix: '/komikindo' });
	await fastify.register(Manhwaindo, { prefix: '/manhwaindo' });

	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		reply.status(200).send({
			message: 'Welcome to YAAAS Manga API!',
			providers: [
				{ name: 'Komikindo', path: '/komikindo' },
				{ name: 'ManhwaIndo', path: '/manhwaindo' },
			],
		});
	});
};

export default Manga;
