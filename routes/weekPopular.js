import express from "express";
import cheerio from "cheerio";
import Browser from "../helpers/puppeteer.js";
import UrlHelper from "../helpers/url.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try{
		const browser = await Browser();
		const page = await browser.newPage();
		await page.goto(UrlHelper.all);
		const content = await page.content();

		const $ = cheerio.load(content);
		const wpop = $("#content #sidebar #wpop-items .wpop-weekly ul li");
		const popular = [];
		wpop.each((idx, el) => {
			const manhwa = {title: "", thumbnail: "", endpoint: ""};
			manhwa.title = $(el).find(".leftseries h2").text();
			manhwa.thumbnail = $(el).find(".imgseries a img").attr("src");
			manhwa.endpoint = $(el).find(".imgseries a").attr("href").replace("https://manhwaindo.id/series/", "");

			popular.push(manhwa);
		});

		await page.close();
		await browser.close();

		res.json({message: "Weekly Popular", manhwas: popular});
	} catch(err) {
		res.json({message: err});
	}
});

export default router;