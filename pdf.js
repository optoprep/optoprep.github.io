var admin = require("firebase-admin");

var serviceAccount = require("/Users/hiteck/projects/optoprep/kmk-opto-firebase-adminsdk-e2b64-47bf1e93cc.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://kmk-opto.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("flashcards");

ref.on("value", function(cards) {
  console.log(cards.val());

  for (var i in cards.val()) {
  	console.log(i);
  	console.log(Object.keys(cards.val()).length);
  }


}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});