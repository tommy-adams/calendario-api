const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const user = require("./models/users");
const _class = require("./models/classes");
const assignment = require("./models/assignments");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const saltRounds = 10;

// LOGIN
app.post("/api/login", async (req, res) => {
  const person = await user.User.findOne({ email: req.body.email });
  if (person) {
    bcrypt.compare(req.body.password, person.password, (err, result) => {
      if (result) {
        res.send(person);
      } else {
        res.send("Password is incorrect.")
      }
    });
  } else {
    res.send("Email does not exist.");
  }
});

// SUBSCRIBE
app.post("/api/subscribe", async (req, res) => {
  await user.User.findOne({ email: req.body.email }, "", {}, (err, person) => {
    if (err) {
      console.error(err);
      res.send(err);
    } else if (person) {
      res.send("Email already exists.");
    } else {
      bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        if (err) {
          console.error(err);
          res.send("We weren't able to subscribe you at this time. Please try again later.");
        } else {
          const newUser = await user.User.create({
            email: req.body.email,
            password: hash,
            firstName: req.body.firstName
          });
          res.send(newUser);
        }
      });
    }
  });
});

// GET USER
app.get("/api/get-user", async (req, res) => {
  const person = await user.User.findOne(req.query);
  res.send(person);
});

// ADD CLASS
app.post("/api/add-class", async (req, res) => {
  const newClass = await _class.Class.create(req.body);
  res.send(newClass);
});

// GET CLASSES
app.get("/api/get-classes", async (req, res) => {
  const classes = await _class.Class.find(req.query);
  res.send(classes);
});

// EDIT CLASS
app.patch("/api/edit-class", async (req, res) => {
  await _class.Class.findOneAndUpdate({_id: req.body._id}, req.body, { upsert: true });
  res.send(req.body);
});

// DELETE CLASS
app.delete("/api/delete-class", async (req, res) => {
  await _class.Class.findOneAndDelete(req.query, {}, (err, doc) => {
    if (err) res.send(500, { err });
    res.send(doc);
  });
});

// CREATE ASSIGNMENT
app.post("/api/add-assignment", async (req, res) => {
  const newAssignment = await assignment.Assignment.create(req.body);
  res.send(newAssignment);
});

// LOAD ASSIGNMENTS
app.get("/api/get-assignments", async (req, res) => {
  const assignments = await assignment.Assignment.find(req.query);
  res.send(assignments);
});

// UPDATE ASSIGNMENT
app.patch("/api/edit-assignment", async (req, res) => {
  await assignment.Assignment.findOneAndUpdate({_id: req.body._id}, req.body, { upsert: true });
  res.send(req.body);
});

// DELETE ASSIGNMENT
app.delete("/api/delete-assignment", async (req, res) => {
  await assignment.Assignment.findOneAndDelete(req.query, {}, (err, doc) => {
    if (err) res.send(500, { err });
    res.send(doc);
  });
});

// DELETE ASSIGNMENTS BY CLASS
app.delete("/api/delete-by-class", async (req, res) => {
  await assignment.Assignment.find(req.query, async (err, docs) => {
    if (err) res.send(500, { err });
    await assignment.Assignment.deleteMany(req.query, {}, (err, doc) => {
      if (err) res.send(500, { err });
      res.send(docs);
    });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));