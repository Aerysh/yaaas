const puppeteer = require("puppeteer-extra");

module.exports = async () => {
  try {
    puppeteer.use(
      require("puppeteer-extra-plugin-block-resources")({
        blockedTypes: new Set(['stylesheet', 'image', 'media', 'font']),
      })
    );

    const _browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--single-process", "--no-zygote"],
    });

    return _browser;
  } catch (err) {
    console.log(err);
  }
};
