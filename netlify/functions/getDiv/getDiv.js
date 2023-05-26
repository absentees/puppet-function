const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

export const handler = async (event, context) => {
  // Extract event.body into an object
  // const { url, selector } = JSON.parse(event.body);
  // console.log(`Looking for ${selector} in ${url}`);
  let value = null;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
    headless: chromium.true,
    ignoreHTTPSErrors: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://apple.com");
    await page.waitForSelector("h1");
    value = await page.$eval(selector, el => el.innerText);
    await browser.close();

    // Return the value
    return {
      statusCode: 200,
      body: JSON.stringify({
        value,
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
