const express = require('express');
const _browser = require('../helpers/puppeteer');
const cheerio = require('cheerio');
const router = express.Router();
const { base } = require('../helpers/url');

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
        await page.goto(base + req.params.endpoint);
        const content = await page.content();

        const $ = cheerio.load(content);
        const readTag = $("article");
        const chapter = [];
        readTag.each((idx, el) => {
            const read = {title: "", images: []};
            read.title = $(el).find(".headpost .entry-title").text().replace("Komik ", "");
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

module.exports = router;