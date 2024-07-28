import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteShorthandOptions,
} from 'fastify';
import launchBrowser from '../../../utils/puppeteer';
import KusonimeUrlHelper from './url-helper';

const opts: RouteShorthandOptions = {
	schema: {
		tags: ['Kusonime'],
		params: {
			type: 'object',
			properties: {
				endpoint: { type: 'string' },
			},
		},
	},
};

const KusonimeWatch = async (fastify: FastifyInstance) => {
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

				await page.goto(KusonimeUrlHelper.info(request.params.endpoint), {
					waitUntil: 'networkidle2',
				});

				const episodeInfo = await page.evaluate(() => {
					const downloadDivs = Array.from(
						document.querySelectorAll('.smokeddlrh')
					);

					return downloadDivs.map((div) => {
						const title = div.querySelector('.smokettlrh')?.textContent;

						const linksDivs = Array.from(
							div.querySelectorAll('.smokeurlrh')
						).map((link) => {
							const resolutionMatch = link.textContent?.match(/(\d+)(p)?/);

							const resolution = resolutionMatch ? `${resolutionMatch[1]}` : '';

							const links = Array.from(link.querySelectorAll('a')).map((a) => ({
								title: a?.textContent,
								url: a?.href,
							}));

							return {
								resolution,
								mirrors: links,
							};
						});

						return {
							title,
							downloads: linksDivs,
						};
					});
				});

				if (episodeInfo.length === 0) {
					reply.status(404).send({
						message: `The page you're looking for does not exist!`,
					});
					return;
				}

				reply.status(200).send(episodeInfo);
			} catch (error) {
				console.error(error);
				reply.status(500).send({
					message: 'An unexpected error occurred, please try again later.',
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

export default KusonimeWatch;
