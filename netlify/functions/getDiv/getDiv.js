const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const dotenv = require("dotenv").config();

exports.handler = async (event, context) => {

  // Optional: If you'd like to use the legacy headless mode. "new" is the default.
  chromium.setHeadlessMode = "new";

  const browser = await puppeteer.launch({
    args: process.env.IS_LOCAL ? puppeteer.defaultArgs() : chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.IS_LOCAL
      ? "/tmp/localChromium/chromium/mac_arm-1154837/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
      : await chromium.executablePath(),
    headless: process.env.IS_LOCAL ? false : chromium.headless
  });


 

  try {
    let page = await browser.newPage();

    await page.goto('https://www.jbhifi.com.au/products/logitech-mx-master-3s-performance-wireless-mouse-graphite', {
      waitUntil: 'networkidle0',
    });
    
    // Get the h1 on the page
    const title = await page.evaluate(() => {
      return document.querySelector('#pdp-price-cta > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)').innerText;
    });

    await browser.close();

    // Return the value
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: title
      })
    }


  } catch (error) {
    await browser.close();

    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed' })
    }
  }

}
