const express = require("express");
const cheerio = require("cheerio");
const _browser = require("../helpers/puppeteer");
const router = express.Router();
const { latest } = require("../helpers/url");

router.get("/", async (req, res) => {
	try{
		const browser = await _browser();
		const page = await browser.newPage();
		await page.goto(latest);
		const content = await page.content();

		const $ = cheerio.load(content);
		const latestUpdate = $(".listupd .bs");
		const manhwas = [];
		latestUpdate.each((idx, el) => {
			const manhwa = {title: "", chapter: "", thumbnail: "", endpoint: ""};
			manhwa.title = $(el).find(".bsx a").attr("title");
			manhwa.chapter = $(el).find(".bsx a .bigor .adds .epxs").text();
			manhwa.thumbnail = $(el).find(".bsx a .limit img").attr("src");
			manhwa.endpoint = $(el).find(".bsx a").attr("href").replace("https://manhwaindo.id/series/", "");
            
			manhwas.push(manhwa);
		});

		await page.close();
		await browser.close();
        
		res.json({message: "Latest Update Manhwas", manhwas: manhwas});
	} catch(err) {
		res.json({message: err});
	}
});

module.exports = router;