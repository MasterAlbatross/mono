const pick = require("lodash.pick");
const User = require("../models/user");
const Category = require("../models/category");
const httpError = require("../util/errors/httpError");

const getAllCategory = async (req, res) => {
  //filtering
  let match = {};
  if (req.query.name) match.name = { $regex: req.query.name, $options: "i" };
  if (req.query.createdAt)
    match.createdAt = { $gte: new Date(req.query.createdAt), $lte: Date.now() };
  if (req.query.createdBy) match.createdBy = req.query.createdBy;

  try {
    const categories = await Category.find(match)
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip));
    res.send(categories);
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

const getSingleCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .send(httpError("not_found", "Category doesn't exist!"));
    }
    res.send(category);
  } catch (error) {
    res.status(400).send(httpError("not_found", "Invalid id", error));
  }
};

const createCategory = async (req, res) => {
  var categoryInformation = pick(req.body, ["name", "description"]);
  const { _id: createdBy } = req.headers.user;
  categoryInformation.createdBy = createdBy;
  var category = new Category(categoryInformation);
  try {
    const user = await User.findById(createdBy);
    if (!user) {
      return res
        .status(404)
        .send(httpError("not_found", "User doesn't exist!"));
    }
    await category.save();
    res.status(201).send({
      id: category._id,
      ...categoryInformation,
    });
  } catch (error) {
    res
      .status(400)
      .send(httpError("bad_request", "Unable to create Category", error));
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const categoryInformation = pick(req.body, ["name", "description"]);
  const { _id: createdBy } = req.headers.user;
  try {
    const category = await Category.findById({ _id: id, createdBy });
    if (!category) {
      return res
        .status(404)
        .send(httpError("not_found", "Category doesn't exist!"));
    }

    const updates = Object.keys(categoryInformation);
    updates.forEach((update) => {
      category[update] = req.body[update];
    });

    await category.save();
    res.send({ message: "Category updated successfully" });
  } catch (error) {
    res
      .status(400)
      .send(httpError("bad_request", "Unable to update Category", error));
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const { _id: createdBy } = req.headers.user;
  try {
    const category = await Category.findOneAndDelete({ _id: id, createdBy });
    res.send({ message: "Category deleted successfully" });
  } catch (error) {
    return res
      .status(404)
      .send(httpError("not_found", "Category doesn't exist!"));
  }
};

module.exports = {
  getAllCategory,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
