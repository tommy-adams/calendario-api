const mongoose = require("mongoose");
const creds = require("../creds");

creds.connect();

const classSchema = new mongoose.Schema({
  name: String,
  color: String,
  userId: String
}, { collection: "classes" });

exports.Class = mongoose.model("classes", classSchema);
