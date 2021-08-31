const mongoose = require("mongoose");

exports.connect = () => {
  mongoose.connect("mongodb+srv://admin:oDwhyHe8mpjUg7@calendario.4caik.mongodb.net/calendario", {useNewUrlParser: true});
};
