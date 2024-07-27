import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import KomikindoInfo from './info';
import KomikindoSearch from './search';
import KomikindoUrlHelper from './url-helper';

const Komikindo = async (fastify: FastifyInstance) => {
	await fastify.register(KomikindoInfo, { prefix: '/info' });
	await fastify.register(KomikindoSearch, { prefix: '/search' });

	fastify.get(
		'/',
		{
			schema: {
				tags: ['Komikindo'],
			},
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			reply.status(200).send({
				message: `Welcome to Komikindo API! Please visit them at ${KomikindoUrlHelper.base}`,
				routes: [
					{ name: 'Manga Details', path: '/info/:endpoint' },
					{ name: 'Get Manga Chapter', path: '/read/:endpoint' },
					{ name: 'Manga Search', path: '/search/:query/:page' },
				],
			});
		}
	);
};

export default Komikindo;
