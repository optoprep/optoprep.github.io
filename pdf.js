//require('pdfmake/build/pdfmake.js');
//require('imports?this=>window!pdfmake/build/vfs_fonts.js');

var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

var admin = require("firebase-admin");

var serviceAccount = require("/Users/hiteck/projects/optoprep/kmk-opto-firebase-adminsdk-e2b64-47bf1e93cc.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://kmk-opto.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("fcards");

ref.on("value", function(cards) {
  console.log(cards.val());

  for (var i in cards.val()) {
  	console.log(i);
  	console.log(Object.keys(cards.val()).length);
  }


}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };

pdfMake.createPdf(docDefinition).download('test');