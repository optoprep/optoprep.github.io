const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
  	headless: false
  });
  const page = await browser.newPage();

  function delay(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  const USERNAME_SELECTOR = 'body > section.home-smartphone-tablet.visible-xs.visible-sm > div > div.row.visible-xs.visible-sm > div.col-xs-12.col-sm-7 > div > form > div:nth-child(3) > input'; // "#login_field" is the copied value
  const PASSWORD_SELECTOR = 'body > section.home-smartphone-tablet.visible-xs.visible-sm > div > div.row.visible-xs.visible-sm > div.col-xs-12.col-sm-7 > div > form > div:nth-child(4) > input';
  const BUTTON_SELECTOR = 'body > section.home-smartphone-tablet.visible-xs.visible-sm > div > div.row.visible-xs.visible-sm > div.col-xs-12.col-sm-7 > div > form > button';
  const NEXT_BUTTON_SELECTOR = '#btn-next';

  const OCULAR_ANATOMY_LINK = 'https://app.optometryboardsreview.com/flashcards/1afa6cc7-cb8d-4966-8e58-8dc03609ca66?include_advanced%3F=true&include_all%3F=false'
  const OCULAR_PHYS_LINK = 'https://app.optometryboardsreview.com/flashcards/869884fa-7017-4809-9dfa-6d06b607d8ae?include_advanced%3F=true&include_all%3F=false';
  const OCULAR_DISEASE_LINK = 'https://app.optometryboardsreview.com/flashcards/aa348612-c24a-4182-aa66-a19e27162eff?include_advanced%3F=true&include_all%3F=false';
  const SYSTEMIC_DISEASE_LINK = 'https://app.optometryboardsreview.com/flashcards/76a3c7d1-187b-4d48-93b0-b3392331b07f?include_advanced%3F=true&include_all%3F=false';
  const PHARMACOLOGY_LINK = 'https://app.optometryboardsreview.com/flashcards/989ddfd0-0b7c-4446-952f-0f96283750c7?include_advanced%3F=true&include_all%3F=false'
  const PHYSIOLOGIAL_OPTICS_LINK = 'https://app.optometryboardsreview.com/flashcards/05837057-9b75-433a-a262-16387be67cbf?include_advanced%3F=true&include_all%3F=false';
  const OCULAR_MOTILITY_LINK = 'https://app.optometryboardsreview.com/flashcards/82a32650-5a17-4ace-88df-90b4a8e31680?include_advanced%3F=true&include_all%3F=false';
  const VISUAL_PERCEPTION_LINK = 'https://app.optometryboardsreview.com/flashcards/2befd0a9-8196-46e3-be22-1660ec2a797f?include_advanced%3F=true&include_all%3F=false';
  const GEOMETRIC_OPTICS_LINK = 'https://app.optometryboardsreview.com/flashcards/deb2ecf3-66c4-4a26-a0cd-e57f54fcc5fe?include_advanced%3F=true&include_all%3F=false';
  const NEUROSCIENCE_LINK = 'https://app.optometryboardsreview.com/flashcards/71bcd68c-c159-4c86-8a1b-f5d63a9f64dc?include_advanced%3F=true&include_all%3F=false';

  var topic_list = [
    ['ocular_anatomy', 'Ocular Anatomy',  OCULAR_ANATOMY_LINK],
    ['ocular_physiology', 'Ocular Physiology',  OCULAR_PHYS_LINK],
    ['ocular_disease', 'Ocular Disease',  OCULAR_DISEASE_LINK],
    ['systemic_disease', 'Systemic Disease',  SYSTEMIC_DISEASE_LINK],
    ['pharmacology', 'Pharmacology',  PHARMACOLOGY_LINK],
    ['physiological_optics', 'Physiological Optics',  PHYSIOLOGIAL_OPTICS_LINK],
    ['ocular_motility', 'Ocular Motility / Binocular Vision',  OCULAR_MOTILITY_LINK],
    ['visual_perception', 'Visual Perception',  VISUAL_PERCEPTION_LINK],
    ['geometric_pptics', 'Geometric Optics',  GEOMETRIC_OPTICS_LINK],
    ['neuroscience', 'Neuroscience',  NEUROSCIENCE_LINK]
  ];

  var admin = require("firebase-admin");
  var serviceAccount = require("/Users/hiteck/projects/optoprep/kmk-opto-firebase-adminsdk-e2b64-47bf1e93cc.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kmk-opto.firebaseio.com"
  });
  var db = admin.database();

  for (j = 0; j < topic_list.length; j++) {
    var element = topic_list[j];
    var topic = element[0];
    var ref = db.ref("kmk/" + topic);
    var num_pages = 0;

    ref.on("value", function(cards) {
      //console.log(cards.val());
      old_cards = cards.val();

      if (old_cards != null) {
        console.log("Existing cards length: " + Object.keys(old_cards).length);
        num_pages = Math.ceil(Object.keys(old_cards).length/3);
        //console.log('Number of pages: ' + num_pages);
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    await delay(3000);
    console.log("Num pages: " + num_pages);
    for (i = 0; i<=num_pages; i++) {
      await page.goto('https://optoprep.github.io/kmk.html?p='+i+'&t='+topic);
      await delay(500);
      await page.screenshot({ path: 'kmk_cards/' + topic + '-' + i + '.png', fullPage: true });
      console.log("Processing " + topic + ", page " + i);
    }
  }

}

run();