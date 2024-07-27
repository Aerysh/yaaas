import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteShorthandOptions,
} from 'fastify';
import KomikindoUrlHelper from './url-helper';
import launchBrowser from '../../../utils/puppeteer';

const opts: RouteShorthandOptions = {};

const KomikindoRead = async (fastify: FastifyInstance) => {
	fastify.get<{ Params: { endpoint: string } }>(
		'/:endpoint',
		opts,
		async (
			request: FastifyRequest<{ Params: { endpoint: string } }>,
			reply: FastifyReply
		) => {
			let browser;
			let page;
			try {
				browser = await launchBrowser();
				page = await browser.newPage();

				await page.goto(KomikindoUrlHelper.read(request.params.endpoint), {
					waitUntil: 'networkidle2',
				});

				await page.content();

				const chapterInfo = await page.$$eval('#readerarea img', (imgs) => {
					return imgs.map((img) => ({
						id: `image_${Math.random().toString(36).substring(2, 10)}`, // Random ID cuz if I only return image src it's kinda boring
						src: img.src,
					}));
				});

				if (chapterInfo.length === 0) {
					reply.status(404).send({
						message: 'The page you are looking for does not exist.',
					});
				}

				reply.status(200).send(chapterInfo);
			} catch (error) {
				console.error(error);
				reply.status(500).send({
					message: `An unexpected error occurred, please try again later.`,
				});
			} finally {
				if (page) {
					await page.close().catch(console.error);
				}
				if (browser) {
					await browser.close().catch(console.error);
				}
			}
		}
	);
};

export default KomikindoRead;
