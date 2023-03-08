var mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: { unique: true },
      required: [true],
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true],
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
