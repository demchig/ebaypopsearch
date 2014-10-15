// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var path = require('path');

var cheerio = require('cheerio');
var fs = require("fs");
var ebayClient = require("./lib/ebayAPIClient.js");


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 8081;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
router.route('/categories')
    // create a bear (accessed at POST http://localhost:8080/api/categories)
    .post(function(req, res) {
        // dummy       
    })
    .get(function(req, res) {
        getCategories(function(categories) {
            res.json(categories);
        });
    });


router.route('/popularItems/:siteid/:catid/:keyword')
    // create a bear (accessed at POST http://localhost:8080/api/categories)
    .post(function(req, res) {
        // dummy       
    })
    .get(function(req, res) {
        var siteId = req.params.siteid;
        var catId = req.params.catid;
        var keyword = req.params.keyword;
        getPopularItems(siteId, catId, keyword, function(items){
            res.json(items);
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);




// =============================================================================
// functions 
// =============================================================================
function getCategories(callback){
    var content = fs.readFileSync("categories.html");

    var $ = cheerio.load(content);

    var categories = [];

    $("option").each(function(i, dom){
        var option = $(this);
        var catId = option.val();

        console.log(option.text() + " " + catId);

        var category = {
            id : catId,
            title : option.text(),
        };

        categories.push(category);
    });

    callback(categories);
}


function getPopularItems(siteId, catId, keyword, callback){
 
        var params = {
            SiteID : siteId,
            CategoryID : catId,
            MaxEntries : 5,
            QueryKeywords : keyword,
        };

        console.log(params);

        if( ! catId || catId == 0 ){
            // for entire site(no category specified)
            console.log("for entire site");
            delete params.CategoryID;
        }

        ebayClient.get("FindPopularItems", params, function(body){
            //console.log(body);
            //console.log(body.ItemArray);
            var categories = [];

            if( body.ItemArray && "Item" in body.ItemArray ){
                //console.log(body.ItemArray.Item);
                console.log(body.ItemArray.Item[0]);
                callback({
                    items : body.ItemArray.Item,
                    siteId : siteId,
                    catid : catId,
                    keyword : keyword,
                });
            }
            else{
                callback({
                    items : [],
                    siteId : siteId,
                    catid : catId,
                    keyword : keyword,
                })
            }

        });
}

