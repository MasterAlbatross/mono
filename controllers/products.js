const pick = require("lodash.pick");
const Product = require("../models/products");
const User = require("../models/user");
const Category = require("../models/category");
const httpError = require("../util/errors/httpError");
const category = require("../models/category");

const getAllProduct = async (req, res) => {
  //filtering
  let match = {};
  if (req.query.name) match.name = { $regex: req.query.name, $options: "i" };
  if (req.query.createdAt)
    match.createdAt = { $gte: new Date(req.query.createdAt), $lte: Date.now() };
  if (req.query.priceFrom)
    match.price = { $gte: parseInt(req.query.priceFrom) };
  if (req.query.priceTo) match.price = { $lte: parseInt(req.query.priceTo) };
  if (req.query.priceTo && req.query.priceFrom)
    match.price = {
      $gte: parseInt(req.query.priceFrom),
      $lte: parseInt(req.query.price),
    };
  if (req.query.category)
    match.category = { $regex: req.query.category, $options: "i" };

  try {
    const products = await Product.find(match)
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip));
    res.send(products);
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

const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .send(httpError("not_found", "Product doesn't exist!"));
    }
    res.send(product);
  } catch (error) {
    res.status(400).send(httpError("not_found", "Invalid id", error));
  }
};

const createProduct = async (req, res) => {
  var productInformation = pick(req.body, [
    "name",
    "description",
    "image",
    "price",
    "category",
  ]);
  const { _id: createdBy } = req.headers.user;
  const { category } = productInformation;
  productInformation.createdBy = createdBy;
  var product = new Product(productInformation);
  try {
    const categoryy = await Category.findOne({ name: category });
    if (!categoryy) {
      return res
        .status(404)
        .send(httpError("not_found", "Category doesn't exist!"));
    }
    await product.save();
    res.status(201).send({
      id: product._id,
      ...productInformation,
    });
  } catch (error) {
    res
      .status(400)
      .send(httpError("bad_request", "Unable to create Product", error));
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const productInformation = pick(req.body, [
    "name",
    "description",
    "image",
    "price",
    "category",
  ]);
  const { _id: createdBy } = req.headers.user;
  const { category } = productInformation;
  try {
    const product = await Product.findOne({ _id: id, createdBy });
    if (!product) {
      return res
        .status(404)
        .send(httpError("not_found", "Product doesn't exist!"));
    }

    if (category) {
      const categoryy = await Category.findOne({ name: category });
      if (!categoryy) {
        return res
          .status(404)
          .send(httpError("not_found", "Category doesn't exist!"));
      }
    }
    const updates = Object.keys(productInformation);
    updates.forEach((update) => {
      product[update] = req.body[update];
    });

    await product.save();
    res.send({ message: "Product updated successfully" });
  } catch (error) {
    res
      .status(400)
      .send(httpError("bad_request", "Unable to update Product", error));
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { _id: createdBy } = req.headers.user;
  try {
    const product = await Product.findOneAndDelete({ _id: id, createdBy });
    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    return res
      .status(404)
      .send(httpError("not_found", "Product doesn't exist!"));
  }
};

module.exports = {
  getAllProduct,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
