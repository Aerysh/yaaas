import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const Browser = async () => {
  try {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    return browser;
  } catch (err) {
    console.log(err);
  }
};

export default Browser;
