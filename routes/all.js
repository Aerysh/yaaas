const express = require('express');
const axios = require('axios')
const cheerio = require('cheerio');
const router = express.Router();
const { all } = require('../helpers/url');

router.get('/:page', async (req, res) => {
    try{
        const { data } = await axios.get(all + req.params.page);
        const $ = cheerio.load(data);
        const manhwaList = $(".postbody .mrgn .listupd .bs");
        const manhwas = [];
        manhwaList.each((idx, el) => {
            const manhwa = {title: "", thumbnail: "", latest_chapter: "", endpoint: ""};
            manhwa.title = $(el).find(".bsx a").attr("title");
            manhwa.thumbnail = $(el).find(".bsx a .limit img").attr("src"); 
            manhwa.latest_chapter = $(el).find(".bsx a .bigor .adds .epxs").text();
            manhwa.endpoint = $(el).find(".bsx a").attr("href").replace("https://manhwaindo.id/series/", "");

            manhwas.push(manhwa);
        });

        res.json({message: "All Manhwa List", manhwas: manhwas});
    } catch(err) {
        res.json({message: err});
    }
});

module.exports = router;