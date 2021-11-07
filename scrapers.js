const puppeteer = require('puppeteer');

async function scrapeCoinbase(url) {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(url);
  var element = await page.waitForXPath("/html/body/div[1]/div/div[1]/main/div/section[2]/div/div/div[1]/div/div/div/div/div[1]/div[1]/div[1]/span[2]")
  
  var price_whole = await page.evaluate(element => element.textContent, element);

  element = await page.waitForXPath('/html/body/div[1]/div/div[1]/main/div/section[2]/div/div/div[1]/div/div/div/div/div[1]/div[1]/div[1]/span[3]');
  var price_cent = await page.evaluate(element => element.textContent, element);

  var price = price_whole + price_cent;

  browser.close()
  return (price);
}

async function scrapeWeBull(crypto) {
  const browser = await puppeteer.launch({
    headless: false
  });
  const url = 'https://app.webull.com/trade'
  const page = await browser.newPage();
  await page.goto(url)
  var search = await page.waitForXPath("/html/body/div[1]/div/div[2]/input");
  if (search) {
    await search.click();
    await page.keyboard.type(crypto);
    await page.keyboard.press('Enter');
  }
  var element = await page.waitForXPath("/html/body/div[1]/div/div[3]/div/div[1]/div[2]/div[1]/div[1]/div/div[1]/span[2]");

  var price = await page.evaluate(element => element.textContent, element);

  browser.close()
  return (price);
}

function price(value) {
  console.log("Price of buying 1 Crypto: $" + (value));
  console.log("Estimated gain from selling 1 Crypto: $" + (value));
}

function statement(cb, wb) {
  console.log("Coinbase's BTC: $" + cb);
  price(cb);
  console.log();
  console.log("WeBull's BTC: $" + wb);
  price(wb);
  console.log();
}

function compare(cb, wb) {
  if (cb > wb) {
    console.log("We recommend selling your cryptocurrency at Coinbase and buy at WeBull");
  }

  else if (wb > cb) {
    console.log("We recommend selling your cryptocurrency at WeBull and buy at Coinbase");
  }

  else {
    console.log("Both values are the same at both exchange sites")
  }
}

(async () => {
  var cbBTC = await scrapeCoinbase('https://www.coinbase.com/price/bitcoin');
  var wbBTC = await scrapeWeBull('BTCUSD');
  statement(cbBTC, wbBTC);
  compare(cbBTC, wbBTC);
})();