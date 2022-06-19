const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();

connectionString = process.env.CONNECTION_STRING;
mongoose.connect(connectionString + "/wikiDB");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);



////////////////////////////////////////////////Request targetting all articles//////////////////////////////////////////////////

app.route("/articles")
    .get(function(req, res){
        Article.find(function(err, foundArticles){
            if (err){
                console.log(err);
            } else {
                res.send(foundArticles);
            }
        }); 
    })

    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content 
        });
        newArticle.save(function (err) {
            if(!err){
                res.send("Successfully added a new article.");
            } else {
                res.send(err); 
            }
        });   
    })
 
    .delete(function (req, res) {
    Article.deleteMany( function (err) {
        if(!err){
            res.send("Successfully deleted all articles");
        } else {
            res.send(err );
        }
    });
    });

////////////////////////////////////////////////Request targetting particular article //////////////////////////////////////////////////

app.route("/articles/:articleTitle")
    .get(function(req, res){
        requestedArticle = _.startCase(_.toLower(req.params.articleTitle));
        console.log(req.params.articleTitle);
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No article was found matching the title " + req.params.articleTitle);
            }
        }); 
    })

    .put(function (req, res) {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err, foundArticle) {
                if(foundArticle){
                    res.send("Successfully updated the Article with title: " + req.params.articleTitle);
                }
                else{
                    res.send("No article present with title: " +  req.params.articleTitle);
                }
            }
        );
    })
    
    .patch(function (req, res) {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err, foundArticle) {
                if(foundArticle){
                    res.send("Successfully updated the Article with title: " + req.params.articleTitle);
                }
                else{
                    res.send("No article present with title: " +  req.params.articleTitle);
                }
            }
        ); 
    })

    .delete(function (req, res) {
        Article.deleteOne({title: req.params.articleTitle}, function (err) {
            if(!err){
                res.send("Successfully deleted the article with title: " + req.params.articleTitle);
            } else {
                res.send(err );
            }
        });
    });


let port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
}
app.listen(port, function(){
    console.log("The app has started on port : " + port);
})