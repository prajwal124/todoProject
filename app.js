const express = require(`express`);
const bodyParser = require(`body-parser`);
const date = require(__dirname + `/date.js`);
const mongoose = require("mongoose");
const app = express();

// for Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

//for using static CSS PAGE in public folder
app.use(express.static(`public`));

//for using EJS
app.set("view engine", "ejs");

//creating and connect to DB todoDB in one line
//mongoose.connect("mongodb://localhost:27017/todoListDB");
mongoose.connect(
  "mongodb+srv://prajwal124:testpassword@cluster0.lxzzk.mongodb.net/todoListDB"
);

//create todo list schema
const todoListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter the List Name!"], //validation where List name is must required.
  },
  dateCreated: Date,
});

//Create Mongoose table/model for todoListSchema/table
const todoListItem = mongoose.model(`ListItem`, todoListSchema);
const workListItem = mongoose.model(`WorkItem`, todoListSchema);

//INSERTING THE LIST TO THE DB
function insertItemToDB(listName, dbCollectionName) {
  dbCollectionName.insertMany(
    {
      name: listName,
      dateCreated: date.getDate(),
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Item Inserted: ${listName}`);
      }
    }
  );
}

//Two Local Arrays to hold items one for home page, other for work page
//Can push items to a const array in JS
const newListItems = [];
const workListItems = [];

//post request when we click add items, either posts to work page or home page
app.post("/", (req, res) => {
  if (req.body.button === "Work") {
    workListItems.push(req.body.newList);
    insertItemToDB(req.body.newList, workListItem);
    res.redirect(`/work`);
  } else {
    newListItems.push(req.body.newList);
    insertItemToDB(req.body.newList, todoListItem);
    res.redirect(`/`);
  }
});

//DELETE PAGE POST REQUEST WHEN CHECKBOX TICKED TO DELETE AN ITEM FROM DB AND LIST
app.post("/delete", (req, res) => {
  //TO HOLD ITEM ID TO DELETE FROM DATABSE
  const checkedItemId = req.body.checkBox;
  //TO PRINT THE DELETED ITEM NAME
  var checkedItemName = "";
  //TO HOLD THE PAGE NAME, TO DELETE FROM 2 DIFFERENT LISTS
  const pageRequested = req.body.page;
  // console.log(pageRequested);

  // TO DELETE FROM TODO LIST
  if (
    pageRequested === "Todo" ||
    pageRequested[0] === "T" ||
    pageRequested[0] === "Todo"
  ) {
    // Finds the item by id, and stores its name to log it after deletion
    todoListItem.findById(checkedItemId, (err, docs) => {
      if (err) console.log(err);
      else {
        checkedItemName = docs.name;
      }
    });
    // TO Remove the give itemID from the Database
    todoListItem.findByIdAndRemove(checkedItemId, (err) => {
      if (err) console.log(err);
      else {
        console.log(`Item Deleted : ${checkedItemName}`);
      }
      res.redirect(`/`);
    });
  }

  // TO DELETE FROM WORK LIST
  else {
    //Finds the item by id, and stores its name to log it after deletion
    workListItem.findById(checkedItemId, (err, docs) => {
      if (err) console.log(err);
      else {
        checkedItemName = docs.name;
      }
    });
    //TO Remove the give itemID from the Database
    workListItem.findByIdAndRemove(checkedItemId, (err) => {
      if (err) console.log(err);
      else {
        console.log(`Item Deleted : ${checkedItemName}`);
      }
      res.redirect(`/work`);
    });
  }
});

//get request to display work page
app.get("/work", (req, res) => {
  //Fetching work list items from database
  workListItem.find((err, foundItems) => {
    if (err) console.log(err);
    else {
      res.render("list", {
        currentDay: date.getDate(),
        pageTitle: "Work",
        newItem: foundItems,
      });
    }
  });
});

//get request to display home page
app.get("/", (req, res) => {
  //exported date function from date.js

  //Fetchinng todo list items from database
  todoListItem.find((err, foundItems) => {
    if (err) console.log(err);
    else {
      res.render("list", {
        currentDay: date.getDate(),
        pageTitle: "Todo",
        newItem: foundItems,
      });
    }
  });
});

//app listeing to port 3000 or dynamic port
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at port 3000...");
});
