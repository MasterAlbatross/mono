const pick = require("lodash.pick");
const Favorite = require("../models/favorite");
const News = require("../models/news");
const httpError = require("../util/errors/httpError");

const getAllFavorites = async (req, res) => {
  const { _id: user } = req.headers.user;
  try {
    const favoriteNews = await Favorite.find({ user })
      .populate("news")
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip));
    res.send(favoriteNews);
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

const createFavorite = async (req, res) => {
  var favoriteInformation = pick(req.body, ["news"]);
  const { _id: user } = req.headers.user;
  favoriteInformation.user = user;
  const { news: id } = favoriteInformation;
  try {
    //Searching if news exist for the Favorite
    const news = await News.findById(id);
    if (!news) {
      return res
        .status(404)
        .send(httpError("not_found", "News doesn't exist!"));
    }

    var favorite = await Favorite.findOne({ user });
    if (!favorite) {
      favorite = new Favorite(favoriteInformation);
    } else {
      favorite.news.push(news);
    }
    await favorite.save();
    res.status(201).send({
      id: favorite._id,
      ...favoriteInformation,
    });
  } catch (error) {
    res
      .status(400)
      .send(httpError("bad_request", "Unable to create Favorite", error));
  }
};

const deleteFavorite = async (req, res) => {
  const { id } = req.params;
  const { _id: user } = req.headers.user;
  try {
    var favorite = await Favorite.findOne({ user });
    favorite.news = favorite.news.filter(function (item) {
      return item.toString() !== id;
    });
    await favorite.save();
    res.send({ message: "Favorite removal successful" });
  } catch (error) {
    return res
      .status(404)
      .send(httpError("not_found", "Favorite doesn't exist!"));
  }
};

module.exports = {
  getAllFavorites,
  createFavorite,
  deleteFavorite,
};
