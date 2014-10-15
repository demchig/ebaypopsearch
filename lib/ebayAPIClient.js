var request = require("request");
var querystring = require("querystring");

var exports = exports || {};

exports.get = function(method, params, callback){

	var query_string = querystring.stringify(params);

	var options = {
		uri : "http://open.api.ebay.com/shopping?" + query_string + "&responseencoding=JSON&callname=" + method,
		method : "GET",
		headers : {
			"X-EBAY-API-APP-ID" : "demchigb-8ce0-406f-8338-ee3af6f5b029",
			"X-EBAY-API-VERSION": 873,
			"X-EBAY-API-SITE-ID": 0,
			"X-EBAY-API-REQUEST-ENCODING" : "NV"
		},
		json : true,
	};

	if( "SiteID" in params ){
		options.headers["X-EBAY-API-SITE-ID"] = params.SiteID;
	}

	console.log(options);

	request(options, function(err, res, body){
		if(err)	console.log(err);
		//console.log(res);
		callback(body);
	});
};

/*
var params = {
	CategoryID : 550,
	QueryKeywords : "Japan"
};

exports.get("FindPopularItems", params, function(body){
	console.log(body);
});*/