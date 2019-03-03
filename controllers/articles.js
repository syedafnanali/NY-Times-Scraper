let scrape = require("../scraper/scrape");
let Article = require("../models/Article");

module.exports = {
  import: function(callback) {
    scrape(function(data) {
      let art_array = data;
      for (let i = 0; i < art_array.length; i++) {
        art_array[i].date = new Date();
        art_array[i].saved = false;
        art_array[i].note = [];
      }
      Article.collection.insert(art_array, { ordered: false }, function(
        err,
        docs
      ) {
        callback(err, docs);
      });
    });
  },

  get: function(req, cb) {
    Article.find(req)
      .sort({
        _id: -1
      })
      .exec(function(err, doc) {
        cb(doc);
      });
  },

  update: function(req, cb) {
    Article.update(
      { _id: req.id },
      {
        $set: { saved: req.saved }
      },
      {},
      cb
    );
  },

  addNote: function(req, cb) {
    Article.findOneAndUpdate(
      { _id: req.id },
      {
        $push: { note: req.note }
      },
      {},
      cb
    );
  }
};
