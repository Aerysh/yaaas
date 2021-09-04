const puppeteer = require('puppeteer');

module.exports = async () => {
    try{
        const _browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
              ],
        });

        return _browser;
    } catch(err) {
        console.log(err);
    }
}