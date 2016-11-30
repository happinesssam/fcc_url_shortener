var express = require('express')
var app = express();
var path = require('path');
var validUrl = require('valid-url');
var mongo = require('mongodb').MongoClient;
var credentials = require("./credentials");
var shortid = require("shortid");

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('index', { url:req.protocol + '://' + req.get('host') + "/new/"});
});

app.get('^/new/*', function (req, res) {
    var newUrl = req.url.substr(5);
    if(validUrl.isUri(newUrl)){
        mongo.connect(credentials.getDBUrl(), function(err, db) {
          // db gives access to the database
        if(err)throw err;
        
        var links = db.collection('links');
        
        var shortId = shortid.generate();
        while(shortId.substr(0, 3)=="new") shortId = shortid.generate();
        links.insert({
            linkId: shortId,
             url:newUrl
            }, function(err, data) {
              if(err)throw err;
              var fullUrl = req.protocol + '://' + req.get('host') + "/" + shortId;
              res.render('result', { oUrl:newUrl,
                linkId: shortId, 
                linkUrl:fullUrl});
              db.close()
            })
        });
    }else{
        res.send("Invalid url");
    }
});
app.get('/:linkId', function (req, res) {
    var linkId = req.params.linkId;
    if(linkId.length>0){
        mongo.connect(credentials.getDBUrl(), function(err, db) {
          // db gives access to the database
        if(err)throw err;
        
        var links = db.collection('links');
        var doc = links.findOne({linkId:linkId}, function(err, result) {
                if(err)throw err;
    
                if(result){
                    res.redirect(result.url);
                }else{
                    res.send("Invalid id");
                }
                db.close();
            });
        });
    }else{
        res.send("Invalid id");
    }
});


var port = process.env.PORT || 8080;
app.listen(port);
