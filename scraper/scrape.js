let request = require("request");
let cheerio = require("cheerio");

let scrape = function(callback) {
  let articles = [];

  request("https://www.nytimes.com", function(err, res, html) {
    let $ = cheerio.load(html);

    $(".css-8atqhb").each(function(i, element) {
      let result = {};
      let aTag = $(this)
        .children("div")
        .children("div")
        .children("a");
      result.link = aTag.attr("href");
      result.title = aTag
        .children("div")
        .children("h2")
        .children("span")
        .text();
      console.log(result);

      if (result.title !== "" && result.link !== "undefined") {
        articles.push(result);
      }
    });
    callback(articles);
  });
};

module.exports = scrape;
