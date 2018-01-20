const puppeteer = require('puppeteer');
var sha256 = require('js-sha256');

async function run() {
  const browser = await puppeteer.launch({
  	headless: false
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1024, height: 800});

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
  const OCULAR_PHYS_LINK = 'https://app.optometryboardsreview.com/flashcards/7af2de75-4ccc-450d-9eb5-7963e249d88c?include_advanced%3F=true';

  await page.goto(OCULAR_PHYS_LINK);

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
  var ref = db.ref("fcards");

  var old_cards = null;

  ref.on("value", function(cards) {
    //console.log(cards.val());
    old_cards = cards.val();
    //for (var i in cards.val()) {
      //console.log(i);
      //console.log(cards.val()[i]);
    //}
    if (old_cards != null) {
      console.log("Existing cards length: " + Object.keys(old_cards).length);
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  console.log("Waiting for 5s...");
  await delay(5000);

  try {

    var i = 1;
    while (true) {
      const q = await page.evaluate(() => document.querySelector( '#flashcard-view > div.flashcard > div.flashcard-container > div.card.col-xs-12 > div.card-flipper > div.front > div.body > div').textContent);
      var hash = sha256(q.trim());
      console.log('\n=====\nQ + ' +i + ', Hash: ' + hash);
      //console.log('Question ' + i + ':\n'+ q.trim());
      existing_card = null;
      if (old_cards != null) {
        existing_card = old_cards[hash];
      }
      if (existing_card != null) {
        console.log("EXISTING CARD: " + existing_card.index);
        
        /*
        var count = existing_card.count;
        console.log("INDEX: " + existing_card.index);
        if (count == null) {
          count = 1;
        } else {
          count = parseInt(existing_card.count) + 1;
        }
        */

      } else {
        console.log("\n===== NEW CARD ===== \n");

        const ANSWER_BUTTON = '#flashcard-view > div.flashcard > div.flashcard-container > div.card.col-xs-12 > div.card-flipper > div.front > div.footer > span.answer-icon > img';
        await page.click(ANSWER_BUTTON);

        const a = await page.evaluate(() => document.querySelector('#flashcard-view > div.flashcard > div.flashcard-container > div.card.col-xs-12.answer > div.card-flipper > div.back > div.body > div').textContent);
        //console.log('Answer:\n' + a.trim());

        var summary = "";
        try {
          const INFO_BUTTON = '#flashcard-view > div.flashcard > div.flashcard-container > div.card.col-xs-12 > div.card-flipper > div.front > div.footer > span.info-icon > i';
          page.click(INFO_BUTTON);

          summary = await page.evaluate(() => document.querySelector('#flashcard-view > div.flashcard > div.overlay > div.overlay-content > div.body > p').textContent);
          //console.log('Summary:\n' + summary.trim() + '\n');
        } catch (ex) {
          //console.log("No summary\n");
        }

        ref.child(hash).set({
            index: i,
            question: q.trim(),
            answer: a.trim(),
            summary: summary.trim()
          });

      }

      const NEXT_BUTTON = '#flashcard-view > div.flashcard > div.flashcard-container > div.nav.col-xs-12.col-md-10.col-lg-3 > div > div > input.next.button.btn';
      const [response] = await Promise.all([
        page.waitForNavigation(),
        page.click(NEXT_BUTTON),
      ]);

      /*
      await ref.child(hash).once('value').then(function(card) {
        if (card.val() === null) {
          console.log("NEW CARD");
          ref.child(hash).set({
            index: i,
            question: q.trim(),
            answer: a.trim(),
            summary: summary.trim()
          });
        } else {
          console.log("EXISTING CARD FOUND: " + card.key + ", " + card.val().index + ', ' + card.val().question);
        }
      });
      */

      //await delay(500);
      /*
      var all_cards = null;
      ref.on("value", function(cards) {
        all_cards = cards;
        //console.log("\n\n\n\n======\n\n" + JSON.stringify(cards) + ", count: "); //+ JSON.stringify(cards));
        console.log('Got all cards, hash ' + hash + ", " + cards);
        console.log('Card found: ' + cards['8bc72dddd1a5be129302b81d4e850c5b8f3c3990a651a4c213c12922ce9b198a']);
        console.log('Card found: ' + cards['32423432']);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
      */
  

      /**

      **/
      i = i+1;
      await delay(1000);

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