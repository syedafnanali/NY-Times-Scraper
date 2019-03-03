let express = require("express");
let mongoose = require("mongoose");
let exphbs = require("express-handlebars");
mongoose.Promise = Promise;
let router = express.Router();

let app = express();
let port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
let localdb = "mongodb://localhost/articles_with_mongo";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(localdb,{useNewUrlParser:true});
}

let db = mongoose.connection;

db.on("error", function(error) {
  console.log(" Error: ", error);
});

db.once("open", function() {
  console.log(" connected.");
});

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/routes")(router);
app.use(router);

app.listen(port, function() {
  console.log("app running on port " + port);
});
