import express from "express";
import cheerio from "cheerio";
import Browser from "../helpers/puppeteer.js";
import UrlHelper from "../helpers/url.js";

const router = express.Router();

router.get("/:endpoint", async (req, res) => {
	try{
		const browser = await Browser();
		const page = await browser.newPage();
		await page.goto(UrlHelper.read + req.params.endpoint);
		const content = await page.content();

		const $ = cheerio.load(content);
		const readTag = $("article");
		const chapter = [];
		readTag.each((idx, el) => {
			const read = {title: "", prevChapter: "", nextChapter: "", images: []};
			read.title = $(el).find(".headpost .entry-title").text().replace("Komik ", "");
			read.prevChapter = $(el).find(".entry-content .chnav .navlef .npv .nextprev .ch-prev-btn")
				.attr("href")
				.replace("#/prev/", "-")
				.replace("https://manhwaindo.id/", "");
			read.nextChapter = $(el).find(".entry-content .chnav .navlef .npv .nextprev .ch-next-btn")
				.attr("href")
				.replace("#/next/", "-")
				.replace("https://manhwaindo.id/", "");
			const chapterImage = $(".entry-content #readerarea img");
			chapterImage.each((idx, el) => {
				const image = {index: "", url: ""};
				image.index = parseInt($(el).attr("data-index")) + 1;
				image.url = $(el).attr("src");

				read.images.push(image);
			});
            
			chapter.push(read);
		});
		await page.close();
		await browser.close();

		res.json({message: "Read Manhwa Chapter", chapter: chapter});
	} catch(err) {
		res.json({message: err});
	}
});

export default router;