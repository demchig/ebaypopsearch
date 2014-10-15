var cheerio = require('cheerio');
var fs = require("fs");
var ebayClient = require("./ebayAPIClient.js");


var content = fs.readFileSync("../categories.html");

var $ = cheerio.load(content);

$("option").each(function(i, dom){
	var option = $(this);
	var catId = option.val();

	console.log(option.text() + " " + catId);

	var params = {
		CategoryID : catId,
		QueryKeywords : "Japan"
	};

	ebayClient.get("FindPopularItems", params, function(body){
		//console.log(body);
		//console.log(body.ItemArray);
		if( body.ItemArray && "Item" in body.ItemArray ){
			console.log(" +++++++++++++++++++++++++++++++++++++++++++++++++++++++ ");
			console.log(body.ItemArray.Item[0]);
		}
	});
});

