const express = require("express");
const cheerio = require("cheerio");
const router = express.Router();
const { search } = require("../helpers/url");
const axios = require("axios");

router.get("/:title", async (req, res) => {
	try{
		const {data} = await axios.get(search + req.params.title);
		const $ = cheerio.load(data);
		const manhwaList = $(".postbody .listupd .bs");
		const manhwas = [];
		manhwaList.each((idx, el) => {
			const manhwa = {title: "", thumbnail: "", latest_chapter: "", endpoint: ""};
			manhwa.title = $(el).find(".bsx a").attr("title");
			manhwa.thumbnail = $(el).find(".bsx a .limit img").attr("src"); 
			manhwa.latest_chapter = $(el).find(".bsx a .bigor .adds .epxs").text();
			manhwa.endpoint = $(el).find(".bsx a").attr("href").replace("https://manhwaindo.id/series/", "");

			manhwas.push(manhwa);
		});

		res.json({message: "Search Manhwa Results", manhwas: manhwas});
	} catch(err) {
		console.log(err);
		res.json({message: err});
	}
});

module.exports = router;