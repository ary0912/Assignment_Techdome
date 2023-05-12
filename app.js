const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');
const Contact = require("./contact");
const Schema = mongoose.Schema;

const homeStartingContent = "Welcome to daily journal!";
const aboutContent = "Write your notes here";
const contactContent = "Feel free to contact us using the form below.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://somaiya3899:dev383838@cluster0.zq6fbtv.mongodb.net/DailyJournalDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const postSchema = new Schema({
  title: { type: String, required: [true, 'Please enter a title'] },
  content: { type: String, required: [true, 'Please enter some content'] }
});

const Post = mongoose.model("Post", postSchema);

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "admin" && password === "password") {
    res.redirect("/");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
});

app.get("/", function (req, res) {
  Post.find({}) // Replace this with your query object
    .exec()
    .then(posts => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    })
    .catch(err => console.log(err));
});

app.get("/about", function (req, res) {
  res.render("about", { theAboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { theContactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle.join(', '),
    content: req.body.postBody
  });

  post.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => console.log(err));
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId })
    .exec()
    .then(post => {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    })
    .catch(err => console.log(err));
});
app.get("/todo", function(req, res) {
  res.sendFile(__dirname + "/todolist-v2-completed-app/views");
});


app.post("/contact", function (req, res) {
  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });

  contact.save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
