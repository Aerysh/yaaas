import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const launchBrowser = async () => {
  try {
    puppeteer.use(StealthPlugin()).use(AdblockerPlugin({ blockTrackers: true }));
    const browserInstance = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--window-size=1920,1080', '--disable-setuid-sandbox'],
    });
    return browserInstance;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default launchBrowser;
