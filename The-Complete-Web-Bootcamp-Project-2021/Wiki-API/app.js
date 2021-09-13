const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.set("views engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB");

const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Article = mongoose.model("Article", ArticleSchema);
app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, articles) {
      if (err) {
        res.send(err);
      } else {
        res.send(articles);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("success");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("success");
      }
    });
  });

app
  .route("/articles/:title")
  .get(function (req, res) {
    const title = req.params.title;
    Article.findOne({ title: title }, function (err, article) {
      if (err) {
        res.send(err);
      } else {
        res.send(article);
      }
    });
  })
  // .put(function (req, res) {
  //   Article.updateOne(
  //     { title: req.params.title },
  //     { title: req.body.title, content: req.body.content },
  //     { overwrite: true },
  //     function (err) {
  //       if (!err) {
  //         console.log("success");
  //       } else {
  //         console.log(err);
  //       }
  //     }
  //   );
  .put(function (req, res) {
    Article.updateOne({ title: req.params.title }, req.body, function (err) {
      if (!err) {
        res.send("success");
      } else {
        res.send(err);
      }
    });
  })

  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.title },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("success");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.title }, function (err) {
      if (!err) {
        res.send("success");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
