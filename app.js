// requiring needed packages
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// initializing express app
const app = express();

// doing useful things
app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// connecting to mongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB");

// create schema
const articleSchema = {
    title: String,
    content: String
};

// create model
const Article = mongoose.model("Article", articleSchema);

// REQUESTS FOR ALL ARTICLES /////////////////////////////////////////////////////////
app.route("/articles")

    .get(function(req, res) {
        Article.find(
            {},
            function(err, foundArticles) {
                if(!err) res.send(foundArticles);
                else res.send(err);
            }
        );
    })

    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(
            function(err) {
                if(!err) res.send("Successfully added a new article.");
                else res.send(err);
            }
        );
    })
    
    .delete(function(req, res) {
        Article.deleteMany(
            {},
            function(err) {
                if(!err) res.send("Successfully deleted all articles.");
                else res.send(err);
            }
        );
    });

// REQUESTS FOR A SPECIFIC ARTICLE /////////////////////////////////////////////////////////
app.route("/articles/:articleTitle")

    .get(function(req, res) {
        Article.findOne(
            {title: req.params.articleTitle}, 
            function(err, foundArticle) {
                if(!err) res.send(foundArticle);
                else res.send("No articles matching that title was found.");
            }
        );
    })

    // replace a particular document
    .put(function(req, res) {
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err) {
                if(!err) res.send("Successfully updated the article.");
                else res.send(err);
            }
        );
    })

    // replace specific fields in a particular document
    .patch(function(req, res) {
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err) {
                if(!err) res.send("Successfully updated specific fields of the article.");
                else res.send(err);
            }
        );
    })

    .delete(function(req, res) {
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err) {
                if(!err) res.send("Successfully deleted the article.");
                else res.send(err);
            }
        );
    });

// listening on a port for requests
app.listen(3000, function() {
    console.log("Server up and running on port 3000");
});