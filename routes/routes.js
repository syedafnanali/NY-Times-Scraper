let Article = require("../models/Article");
let Note = require("../models/Note");
let art_controller = require("../controllers/articles");

module.exports = function(router) {
  router.get("/", function(req, res) {
    Article.find({ saved: false }, function(error, found) {
      if (error) {
        console.log(error);
      } else if (found.length === 0) {
        res.render("no_articles");
      } else {
        let hbsObject = {
          articles: found
        };
        res.render("index", hbsObject);
      }
    });
  });

  router.get("/api/get", function(req, res) {
    art_controller.import(function(err, docs) {
      if (!docs || docs.insertedCount === 0) {
        res.json({ msg: "There is no articles found" });
      } else {
        res.json({ msg: "there is " + docs.insertedCount + " articles found" });
      }
    });
  });

  router.get("/saved", function(req, res) {
    art_controller.get({ saved: true }, function(data) {
      let result = {
        articles: data
      };
      res.render("db_articles", result);
    });
  });

  router.post("/api/articles", function(req, res) {
    art_controller.update(req.body, function(err, data) {
      res.json(data);
    });
  });

  router.get("/notes/:id", function(req, res) {
    Article.findOne({ _id: req.params.id })
      .populate("note")
      .exec(function(error, data) {
        if (error) console.log(error);
        else {
          res.json(data);
        }
      });
  });

  router.post("/notes/:id", function(req, res) {
    let note = new Note(req.body);

    note.save(function(err, data) {
      if (err) console.log(err);

      Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { note: data._id } },
        { new: true },
        function(err, note) {
          if (err) console.log(err);
          res.send(note);
        }
      );
    });
  });

  router.get("/delete/:id", function(req, res) {
    Note.remove({ _id: req.params.id }, function(err) {
      if (err) console.log(err);
      res.redirect("/saved");
    });
  });
  router.get("/reset", (req, res) => {
    Article.remove({}, err => {
      if (err) console.log(err);
      Note.remove({}, err => {
        if (err) console.log(err);
        res.redirect("/");
      });
    });
  });
};
