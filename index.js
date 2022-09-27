const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

const app = express();

dotenv.config();

app.use("/static", express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// connect to db
mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(8000, () => console.log("server up and running"))
});

// method: GET
// get all tasks
app.get('/', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.js", { todoTasks: tasks });
    });
});

// method: POST
// create a task
app.post("/", async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });


app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
});

