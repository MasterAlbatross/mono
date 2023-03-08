var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const path = require("path");
const cors = require("cors");
var oAuth2Server = require("express-oauth-server");
const tokenVerifyAndNormalize = require("./middlewares/tokenVerifyAndNormalize");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");

// config setup
require("./config/db");
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "./locales/{{lng}}/translation.json",
    },
  });

var app = express();

app.oauth = new oAuth2Server({
  model: require("./controllers/auth"),
});

// middleware
app.use(middleware.handle(i18next));
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// auth routes
app.use("/auth/facebook", require("./routes/social/facebook"));
app.use("/auth/google", require("./routes/social/google"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use("/", require("./routes/index"));

app.use("/users", require("./routes/users"));
app.use("/news", require("./routes/news"));
app.use("/products", require("./routes/products"));
app.use("/category", require("./routes/category"));
app.use("/comments", require("./routes/comments"));
app.use("/favorites", require("./routes/favorite"));

module.exports = app;
