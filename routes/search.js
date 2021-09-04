const express = require('express');
const _browser = require('../helpers/puppeteer');
const cheerio = require('cheerio');
const router = express.Router();
const { search } = require('../helpers/url');

router.get('/:title', async (req, res) => {
    try{
        const browser = await _browser();
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if(req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font'){
                req.abort();
            }else{
                req.continue();
            }
        });
        await page.goto(search + req.params.title.replaceAll(" ", "+"));
        const content = await page.content();
        const $ = cheerio.load(content);
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
        await page.close();
        await browser.close();

        res.json({message: "Search Manhwa Results", manhwas: manhwas});
    } catch(err) {
        res.json({message: err});
    }
});

module.exports = router;