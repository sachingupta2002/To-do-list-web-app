//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const path = require("path")
const mongoose = require("mongoose");
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser: true});
const itemsSchema={
  name:String
}
const Item = mongoose.model("Item", itemsSchema);

const item1= new Item({
  name:"Welcome to your todolist"
});

const item2= new Item({
  name:"Hit the + button to add a new item"
});

const item3 = new Item({
  name:"<-- Hit this to delete an item"
});

const defaultItems=[item1,item2,item3];



app.get("/", function(req, res) {

  async function findit() {
    try {
      const result = await Item.find({});
      if(result.length===0)
      {
        Item.insertMany(defaultItems);
        res.redirect("/");
      }
      
      else
      {
        res.render("list",{listTitle :"Today" , newListItems: result});
      }
    } catch (err) {
      console.error(err);
    }
  }
  
  // Call the async function
  findit();
    


  

});

app.post("/", function(req, res){

  const itemName=req.body.newItem;

  const item= new Item({
    name:itemName
  });

  item.save();

  res.redirect("/");

});

app.post("/delete", function(req,res)
{
  

  async function removeitById(checkedItemId) {
    try {
      const result = await Item.findByIdAndRemove(checkedItemId);
      console.log(result);
      res.redirect("/");
    } catch (err) {
      console.error(err);
    }
  }
  
  // Call the function with the person's ID
  const checkedItemId = req.body.checkbox;
  removeitById(checkedItemId);
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
