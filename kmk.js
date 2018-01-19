const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
  	headless: true
  });
  const page = await browser.newPage();

  const USERNAME_SELECTOR = '#user_email';
  const PASSWORD_SELECTOR = '#user_password';
  const BUTTON_SELECTOR = '#new_user > div.actions > div.col-md-10.col-md-offset-1.col-sm-12.padding-bottom-2 > input';
  const ENTER_COURSE_SELECTOR = '#view > div > div > div:nth-child(1) > div.col-md-6.col-sm-12.product-text > div.row.product-buttons > a';
  const FLASHCARD_SELECTOR = '#nav-menu > li:nth-child(5) > a';

  try {
  await page.goto('https://app.optometryboardsreview.com/users/sign_in');
  //await page.waitForSelector(USERNAME_SELECTOR, { visible: true } );


  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type('mbaek@westernu.edu');

  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type('kittylovesmilktea');

  await page.click(BUTTON_SELECTOR);
  console.log("Logging in...");

  await page.waitForNavigation({waitUntil: 'networkidle2'});
  //await page.addStyleTag({path: 'test.css'});

  await page.click(ENTER_COURSE_SELECTOR);
  await page.waitForNavigation({waitUntil: 'networkidle2'});

  await page.click(FLASHCARD_SELECTOR);
  //await page.waitForNavigation({waitUntil: 'networkidle2'});


  const OCULAR_ANATOMY = '#view > div > div:nth-child(2) > div > div:nth-child(1) > div.button.btn > a';

  const OCULAR_ANATOMY_LINK = 'https://app.optometryboardsreview.com/flashcards/1afa6cc7-cb8d-4966-8e58-8dc03609ca66?include_advanced%3F=false'

  await page.goto(OCULAR_ANATOMY_LINK);

  const TOGGLE_ADVANCED = '#flashcard_params > div:nth-child(5) > label';
  const TOGGLE_ALL = '#flashcard_params > div:nth-child(6) > label';
  await page.click(TOGGLE_ADVANCED);
  await page.click(TOGGLE_ALL);

  //const Q_SELECTOR = '#flashcard-view > div.flashcard > div.flashcard-container > div.card.col-xs-12 > div.card-flipper > div.front > div.body > div';

  function delay(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  var admin = require("firebase-admin");

  var serviceAccount = require("/Users/hiteck/projects/optoprep/kmk-opto-firebase-adminsdk-e2b64-47bf1e93cc.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kmk-opto.firebaseio.com"
  });
  var db = admin.database();
  var ref = db.ref("flashcards/ocular_anatomy");

  try {

    var i = 1;
    while (true) {
      const q = await page.evaluate(() => document.querySelector( '#flashcard-view > div.flashcard > div.flashcard-container > div.card.col-xs-12 > div.card-flipper > div.front > div.body > div').textContent);
      console.log('Question ' + i + ': '+ q.trim());

      const ANSWER_BUTTON = '#flashcard-view > div.flashcard > div.flashcard-container > div.card.col-xs-12 > div.card-flipper > div.front > div.footer > span.answer-icon > img';
      await page.click(ANSWER_BUTTON);

      const a = await page.evaluate(() => document.querySelector('#flashcard-view > div.flashcard > div.flashcard-container > div.card.col-xs-12.answer > div.card-flipper > div.back > div.body > div').textContent);
      console.log('Answer: ' + a.trim() + '\n');

      const NEXT_BUTTON = '#flashcard-view > div.flashcard > div.flashcard-container > div.nav.col-xs-12.col-md-10.col-lg-3 > div > div > input.next.button.btn';
      await page.click(NEXT_BUTTON);
      //await page.click(TOGGLE_ADVANCED);

      await delay(500);

      ref.child(i).set({
        question: q.trim(),
        answer: a.trim()
      });
      i = i+1;

    }

  } catch (e) {
    console.log(e);
    console.log("Exiting flashcard loops...");
  }

  //await page.waitForNavigation({waitUntil: 'networkidle2'});
  
  //await page.goto('https://app.optometryboardsreview.com/flashcard_groups')
  //await page.waitForNavigation({waitUntil: 'networkidle2'});
  //await page.addStyleTag({path: 'test.css'});
  //await page.waitFor(500);

  // for (i=1; i<=912; i++) {
  // 	  await page.screenshot({ path: 'screenshots/' + i + '.png', fullPage: true });
  // 	  await page.click(NEXT_BUTTON_SELECTOR);
  // 	  await page.waitFor(500);
  // 	  console.log("Processing page " + i);
  // }

  //browser.close();
  } catch (e) {
  	console.log(e);
  }
}

run();