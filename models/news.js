var mongoose = require("mongoose");
const Comment = require("./comments");

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true],
    },
    description: {
      type: String,
    },
    image: {
      type: Buffer,
    },
    logo: {
      type: Buffer,
    },
    tags: {
      type: [String],
    },
    reactions: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
    },
    publisher: {
      type: String,
      required: [true],
    },
    url: {
      type: String,
      required: [true],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
