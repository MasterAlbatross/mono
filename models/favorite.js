var mongoose = require("mongoose");
const News = require("./news");

const FavoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true],
    },
    news: [{ type: mongoose.Schema.Types.ObjectId, unique: true, ref: "News" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favorite", FavoriteSchema);
