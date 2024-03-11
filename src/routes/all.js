import express from "express";
import cheerio from "cheerio";
import Browser from "../utils/puppeteer.js";
import UrlHelper from "../utils/url-helper.js";

const router = express.Router();

router.get("/:page", async (req, res) => {
  try {
    const browser = await Browser();
    const page = await browser.newPage();
    await page.goto(UrlHelper.all + req.params.page);
    const content = await page.content();

    const $ = cheerio.load(content);
    const manhwaList = $(".postbody .bixbox .mrgn .listupd .bs");
    const manhwas = [];
    manhwaList.each((idx, el) => {
      const manhwa = {
        title: "",
        thumbnail: "",
        latest_chapter: "",
        endpoint: "",
      };
      manhwa.title = $(el).find(".bsx a").attr("title");
      manhwa.thumbnail = $(el).find(".bsx a .limit img").attr("src");
      manhwa.latest_chapter = $(el).find(".bsx a .bigor .adds .epxs").text();
      manhwa.endpoint = $(el)
        .find(".bsx a")
        .attr("href")
        .replace("https://manhwaindo.id/series/", "");

      manhwas.push(manhwa);
    });

    await page.close();
    await browser.close();

    res.json({ message: "All Manhwa List", manhwas: manhwas });
  } catch (err) {
    res.json({ message: err });
  }
});

export default router;
