const puppeteer = require('puppeteer');
var sha256 = require('js-sha256');

async function run() {

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
  var old_ref = db.ref("flashcards/ocular_anatomy")
  var temp_ref = db.ref("temp_cards");

  var old_cards = null;

  temp_ref.on("value", function(cards) {
    old_cards = cards.val();
    if (old_cards != null) {
      console.log("Existing cards length: " + Object.keys(old_cards).length);
      var i = 1;
      /*
      Object.keys(old_cards).forEach(function (prop) {  
          console.log(prop + ": " + old_cards[prop].question);

          var hash = sha256(old_cards[prop].question.trim().trim());

          temp_ref.child(hash).set({
            index: i,
            question: old_cards[prop].question.trim(),
            answer: old_cards[prop].answer.trim()
          });
          i = i + 1;
      });
      */
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  
}

run();