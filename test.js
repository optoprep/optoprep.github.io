const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
  	//headless: false
  });
  const page = await browser.newPage();

  const USERNAME_SELECTOR = 'body > section.home-smartphone-tablet.visible-xs.visible-sm > div > div.row.visible-xs.visible-sm > div.col-xs-12.col-sm-7 > div > form > div:nth-child(3) > input'; // "#login_field" is the copied value
  const PASSWORD_SELECTOR = 'body > section.home-smartphone-tablet.visible-xs.visible-sm > div > div.row.visible-xs.visible-sm > div.col-xs-12.col-sm-7 > div > form > div:nth-child(4) > input';
  const BUTTON_SELECTOR = 'body > section.home-smartphone-tablet.visible-xs.visible-sm > div > div.row.visible-xs.visible-sm > div.col-xs-12.col-sm-7 > div > form > button';
  const NEXT_BUTTON_SELECTOR = '#btn-next';

  try {
  await page.goto('https://www.optoprep.com/');
  //await page.waitForSelector(USERNAME_SELECTOR, { visible: true } );


  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type('chul@westernu.edu');

  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type('kittylovesmilktea');

  await page.click(BUTTON_SELECTOR);
  console.log("Logging in...");

  await page.waitForNavigation({waitUntil: 'networkidle2'});
  //await page.addStyleTag({path: 'test.css'});

  await page.goto('https://www.optoprep.com/simboards/theia/p1/slideshow.jsp?ss=p&p=0&page-size=0#1')
  //await page.waitForNavigation({waitUntil: 'networkidle2'});
  await page.addStyleTag({path: 'test.css'});
  await page.waitFor(500);

  for (i=1; i<=2089; i++) {
  	  await page.screenshot({ path: 'screenshots/' + i + '.png', fullPage: true });
  	  await page.click(NEXT_BUTTON_SELECTOR);
      //await page.waitForNavigation({waitUntil: 'networkidle2'});
  	  await page.waitFor(200);
  	  console.log("Processing page " + i);
  }

  //browser.close();
  } catch (e) {
  	console.log(e);
  }
}

run();