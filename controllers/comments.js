const pick = require("lodash.pick");
const Comment = require("../models/comments");
const News = require("../models/news");
const httpError = require("../util/errors/httpError");

const getAllComments = async (req, res) => {
  //id of the news
  const { id } = req.params;
  try {
    const comment = await Comment.find({ reference: id })
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip));
    res.send(comment);
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

const createComment = async (req, res) => {
  var commentInformation = pick(req.body, ["text", "reference"]);
  commentInformation.user = req.headers.user._id;
  var comment = new Comment(commentInformation);
  const { reference: id } = commentInformation;
  try {
    //Searching if news exist ofr the comment
    const news = await News.findById(id);
    if (!news) {
      return res
        .status(404)
        .send(httpError("not_found", "News doesn't exist!"));
    }
    comment.user = req.headers.user._id;
    await comment.save();
    res.status(201).send({
      id: comment._id,
      ...commentInformation,
    });
  } catch (error) {
    res
      .status(400)
      .send(httpError("bad_request", "Unable to create Comment", error));
  }
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { _id: user } = req.headers.user;
  const CommentInformation = pick(req.body, ["text", "reactions"]);
  try {
    const comment = await Comment.findOne({ _id: id, user });

    if (!comment) {
      return res
        .status(404)
        .send(httpError("not_found", "Comment doesn't exist!"));
    }
    const updates = Object.keys(CommentInformation);
    updates.forEach((update) => {
      comment[update] = req.body[update];
    });

    await comment.save();
    res.send({ message: "Comment updated successfully" });
  } catch (error) {
    res
      .status(400)
      .send(httpError("bad_request", "Unable to update Comment", error));
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const { _id: user } = req.headers.user;
  try {
    const comment = await Comment.findOneAndDelete({ _id: id, user });
    res.send({ message: "Comment deleted successfully" });
  } catch (error) {
    return res
      .status(404)
      .send(httpError("not_found", "Comment doesn't exist!"));
  }
};

module.exports = {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
};
