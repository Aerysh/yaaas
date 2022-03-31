const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");

module.exports = async () => {
	try {
		puppeteer.use(
			require("puppeteer-extra-plugin-block-resources")({
				blockedTypes: new Set(["stylesheet", "image", "media", "font"]),
			})
		);

		puppeteer.use(stealthPlugin());

		const _browser = await puppeteer.launch({
			headless: true,
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--single-process",
				"--no-zygote",
			],
		});

		return _browser;
	} catch (err) {
		console.log(err);
	}
};
