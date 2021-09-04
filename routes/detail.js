const express = require('express');
const _browser = require('../helpers/puppeteer');
const cheerio = require('cheerio');
const router = express.Router();
const { detail } = require('../helpers/url');

router.get('/:endpoint', async (req, res) => {
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
        await page.goto(detail + req.params.endpoint);
        const content = await page.content();

        const $ = cheerio.load(content);
        const manhwaDetail = $(".main-info");
        const manhwas = [];
        manhwaDetail.each((idx, el) => {
            const manhwa = {title: "", altTitle: "", genres: [], synopsis: "", thumbnail: "", chapters: []};
            manhwa.title = $(el).find(".info-right .info-desc #titledesktop #titlemove h1").text().replace("Komik ", "");
            manhwa.altTitle = $(el).find(".info-right .info-desc #titledesktop #titlemove span").text();
            
            const manhwaGenre = $(".info-right .info-desc .wd-full .mgen a");
            manhwaGenre.each((idx, el) => {
                const genre = {name: "", endpoint: ""};
                genre.name = $(el).text();
                genre.endpoint = $(el).attr("href").replace("https://manhwaindo.id/genres/", "")

                manhwa.genres.push(genre);
            });

            manhwa.synopsis = $(el).find(".info-right .info-desc .wd-full .entry-content p").text();
            manhwa.thumbnail = $(el).find(".info-left .info-left-margin .thumb img").attr("src");

            const manhwaChapter = $(".bixbox .eplister ul li");
            manhwaChapter.each((idx, el) => {
                const chapter = {name: "", date: "", endpoint: ""};
                chapter.name = $(el).find(".chbox .eph-num a .chapternum").text();
                chapter.date = $(el).find(".chbox .eph-num a .chapterdate").text();
                chapter.endpoint = $(el).find(".chbox .eph-num a").attr("href").replace("https://manhwaindo.id/", "")

                manhwa.chapters.push(chapter);
            });

            manhwas.push(manhwa);
        });
        await page.close();
        await browser.close();

        res.json({message: "Manhwa Detail", manhwa: manhwas});
    } catch(err) {
        res.json({message: err});
    }
});

module.exports = router;