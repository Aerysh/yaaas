const express = require("express");
const cheerio = require("cheerio");
const router = express.Router();
const { base } = require("../helpers/url");
const axios = require("axios");

router.get("/", async (req, res) => {
	try{
		const { data } = await axios.get(base);
		const $ = cheerio.load(data);
		const genreList = $("#sidebar .section .genre li");
		const genres = [];
		genreList.each((idx, el) => {
			const genre = {name: "", endpoint: ""};
			genre.name = $(el).find("a").text();
			genre.endpoint = $(el).find("a").attr("href").replace("https://manhwaindo.id/genres/", "");

			genres.push(genre);
		});

		res.json({message: "Genres List", genres: genres});
	} catch(err) {
		res.json({message: err});
	}
});

router.get("/:endpoint", async(req, res) => {
	try{
		const { data } = await axios.get(base + "genres/" + req.params.endpoint);
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

		res.json({message: "Manhwa by Genre", genre: $(".postbody .bixbox .releases h1").text(), manhwas: manhwas});
	} catch(err) {
		res.json({message: err});
	}
});

module.exports = router;