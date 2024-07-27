import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteShorthandOptions,
} from 'fastify';
import launchBrowser from '../../../utils/puppeteer';
import KomikindoUrlHelper from './url-helper';

const opts: RouteShorthandOptions = {
	schema: {
		tags: ['Komikindo'],
		params: {
			type: 'object',
			properties: {
				endpoint: { type: 'string' },
			},
		},
	},
};

const KomikindoInfo = async (fastify: FastifyInstance) => {
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

				const response = await page.goto(
					KomikindoUrlHelper.info(request.params.endpoint),
					{
						waitUntil: 'networkidle0',
					}
				);

				if (response && response.status() === 404) {
					reply.status(404).send({
						message: 'The page you are looking for was not found',
					});
				}

				const mangaInfo = await page.evaluate(() => {
					if (typeof window === 'undefined')
						throw new Error('window does not exists');

					const additionalInfo = Array.from(
						document.querySelectorAll('.tsinfo div')
					).map((div) => div.textContent);

					let status;
					let type;

					for (const div of additionalInfo) {
						if (div) {
							const [key, value] = div.split(' ').map((part) => part.trim());
							if (key === 'Status') status = value;
							if (key === 'Type') type = value;
						}
					}

					const genres = Array.from(document.querySelectorAll('.mgen a')).map(
						(link) => link.textContent
					);

					const chapters = Array.from(
						document.querySelectorAll('.eplister li')
					).map((li) => {
						const id = li
							.querySelector('a')
							?.getAttribute('href')
							?.split('/')[4];

						const chapterNumber = li.querySelector('.chapternum')?.textContent;

						const url = li.querySelector('a')?.getAttribute('href');

						return {
							id,
							chapterNumber,
							url,
						};
					});

					return {
						id: window.location.href?.split('/')[4],
						title: document.querySelector('.entry-title')?.textContent,
						url: window.location.href,
						thumbnail: document
							.querySelector('.thumb img')
							?.getAttribute('src'),
						releaseDate: document
							.querySelector('.flex-wrap .fmed:nth-child(1) span')
							?.textContent?.replace('\n', ''),
						description: document.querySelector('.entry-content')?.textContent,
						genres,
						type,
						status,
						// TODO:
						// This will return genres if alternative title isn't found
						// Should be able to be fixed by finding div.wd-full that contains b with text "Judul Alternatif"
						// but I'm to lazy to do that
						alternativeTitle: document
							.querySelector('.wd-full span')
							?.textContent?.split(', '),
						chapters,
					};
				});

				reply.status(200).send(mangaInfo);
			} catch (error) {
				console.error(error);
				reply.status(500).send({
					message: 'An unexpected error occured, please try again later.',
				});
			} finally {
				if (page) {
					page.close().catch(console.error);
				}
				if (browser) {
					browser.close().catch(console.error);
				}
			}
		}
	);
};

export default KomikindoInfo;
