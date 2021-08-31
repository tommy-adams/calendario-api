const mongoose = require("mongoose");
const creds = require("../creds");

creds.connect();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String
}, { collection: "users" });

exports.User = mongoose.model("users", userSchema);
