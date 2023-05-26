const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const whatSite = 'https://apple.com/';

exports.handler = async (event, context) => {


  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
    headless: chromium.true,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  const elementFound = async (ele) => {
    try {

      console.log("Element", ele);
      return await page.$eval(ele, (el) => el.innerText);

    } catch (error) {
      console.log(`Element ${ele} not found`);
      return ele = null
    }

  }

  try {

    await page.goto(whatSite);

    let h1 = await elementFound('h1');

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          h1: h1,
        })
    }

  } catch (error) {

    await browser.close();

    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed' }),
    }
  }
}