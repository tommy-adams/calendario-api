const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose.connect(process.env.API_KEY, {useNewUrlParser: true});
};
