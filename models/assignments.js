const mongoose = require("mongoose");
const creds = require("../creds");

creds.connect();

const assignmentSchema = new mongoose.Schema({
  title: String,
  classId: String,
  userId: String,
  description: String,
  due: Date
}, { collection: "assignments" });

exports.Assignment = mongoose.model("assignments", assignmentSchema);
