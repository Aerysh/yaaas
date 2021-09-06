const express = require('express');
const cheerio = require('cheerio');
const router = express.Router();
const { latest } = require('../helpers/url');
const axios = require('axios');

router.get('/', async (req, res) => {
    try{
        const { data } = await axios.get(latest);
        const $ = cheerio.load(data);
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
        
        res.json({message: "Latest Update Manhwas", manhwas: manhwas});
    } catch(err) {
        res.json({message: err});
    }
});

module.exports = router;