var mongoose = require("mongoose");
const url = process.env.DATABASE_URI
mongoose.connect(url, { useNewUrlParser: true })
