const express = require("express");
const cheerio = require("cheerio");
const router = express.Router();
const { all } = require("../helpers/url");
const axios = require("axios");

router.get("/", async (req, res) => {
	try{
		const { data } = await axios.get(all);
		const $ = cheerio.load(data);
		const wpop = $("#content #sidebar #wpop-items .wpop-weekly ul li");
		const popular = [];
		wpop.each((idx, el) => {
			const manhwa = {title: "", thumbnail: "", endpoint: ""};
			manhwa.title = $(el).find(".leftseries h2").text();
			manhwa.thumbnail = $(el).find(".imgseries a img").attr("src");
			manhwa.endpoint = $(el).find(".imgseries a").attr("href").replace("https://manhwaindo.id/series/", "");

			popular.push(manhwa);
		});

		res.json({message: "Weekly Popular", manhwas: popular});
	} catch(err) {
		res.json({message: err});
	}
});

module.exports = router;