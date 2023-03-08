const pick = require("lodash.pick");
const News = require("../models/news");
const User = require("../models/user");
const httpError = require("../util/errors/httpError");

const getAllNews = async (req, res) => {
  //filtering
  let match = {};
  if (req.query.title) match.title = { $regex: req.query.title, $options: "i" };
  if (req.query.date)
    match.date = { $gte: new Date(req.query.date), $lte: Date.now() };
  if (req.query.publisher) match.publisher = req.query.publisher;
  if (req.query.author) match.author = req.query.author;
  if (req.query.tags) {
    let array = req.query.tags.split(",");
    match.tags = { $all: array };
  }

  try {
    const news = await News.find(match)
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip));
    res.send(news);
  } catch (error) {
    res
      .status(500)
      .send(
        httpError(
          "internal_server _error",
          "There is some internal server issue.Try again later.",
          error
        )
      );
  }
};

const getSingleNews = async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findById(id);
    if (!news) {
      return res
        .status(404)
        .send(httpError("not_found", "News doesn't exist!"));
    }
    res.send(news);
  } catch (error) {
    res.status(400).send(httpError("not_found", "Invalid id", error));
  }
};

const createNews = async (req, res) => {
  var newsInformation = pick(req.body, [
    "title",
    "description",
    "tags",
    "date",
    "publisher",
    "url",
  ]);
  newsInformation.author = req.headers.user._id;
  var news = new News(newsInformation);
  try {
    //file upload
    if (req.files) {
      if (req.files.image) {
        news.image = req.files.image[0].buffer;
      }
      if (req.files.logo) {
        news.logo = req.files.logo[0].buffer;
      }
    }

    await news.save();
    res.status(201).send({
      id: news._id,
      ...newsInformation,
    });
  } catch (error) {
    res
      .status(400)
      .send(httpError("bad_request", "Unable to create news", error));
  }
};

const updateNews = async (req, res) => {
  const { id } = req.params;
  const newsInformation = pick(req.body, [
    "title",
    "description",
    "date",
    "reaction",
    "publisher",
    "url",
  ]);
  const { _id: author } = req.headers.user;
  const { reaction } = newsInformation;
  try {
    const news = await News.findOne({ _id: id, author });

    if (!news) {
      return res
        .status(404)
        .send(httpError("not_found", "News doesn't exist!"));
    }

    //reaction handle
    if (reaction === "true") {
      news.reactions += 1;
    } else if (reaction === "false") {
      news.reactions = Math.max(0, news.reactions - 1);
    }

    // Image upload
    if (req.files) {
      if (req.files.image) {
        news.image = req.files.image[0].buffer;
      }
      if (req.files.logo) {
        news.logo = req.files.logo[0].buffer;
      }
    }

    const updates = Object.keys(newsInformation);
    updates.forEach((update) => {
      news[update] = req.body[update];
    });

    await news.save();
    res.send({ message: "News updated successfully" });
  } catch (error) {
    res
      .status(400)
      .send(httpError("bad_request", "Unable to update news", error));
  }
};

const deleteNews = async (req, res) => {
  const { id } = req.params;
  const { _id: author } = req.headers.user;
  try {
    const news = await News.findOneAndDelete({ _id: id, author });
    res.send({ message: "News deleted successfully" });
  } catch (error) {
    return res.status(404).send(httpError("not_found", "News doesn't exist!"));
  }
};

module.exports = {
  getAllNews,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews,
};
