//BASIC SETUP
//============================
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");
var jwt = require('express-jwt');

//setup jwt
var jwtCheck = jwt({
  secret: new Buffer('mEFnSSNBLOLd1jsDPZGftDaDqhhix2J7vurmqqaKg7BJyE87eoCwH04FrPOETYC2', 'base64'),
  audience: 'nhZHsmxhYvJ0J7QpuEuD4smLIY2iHknc'
});

//setup "public" folder
app.use(express.static(path.join(__dirname, 'public')));

//get customer Model
var Customer = require("./models/customer");

//get customer Controller
var customerController = require("./controllers/customerController");

//connect to db
mongoose.connect("mongodb://rasmus:password@ds061374.mlab.com:61374/rasmus1610");

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; //set our PORT

//ROUTING
//==============================
var router = express.Router();

//secure routes
app.use('/api', jwtCheck);

//test middleware
router.use(function(req, res, next) {
  console.log("Some routing is happening");
  next();
});


//test route on "/"
router.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

//Route on "/customers" to make new customer and get all customers
router.route("/api/customers")

  //get all Customers
  .get(customerController.getBeers)

  //create new Customer
  .post(customerController.postBeers);


//Routes on "/customers/:customer_id" to update or delete customer
router.route("/api/customers/:customer_id")

  //get single Customer by it's id
  .get(customerController.getBeer)

  //update single customer by it's id
  .put(customerController.putBeer)

  //delete single customer by id
  .delete(customerController.deleteBeer);


// REGISTER OUR ROUTES ----------------
// all of our routes will be prefixed with /api
app.use(router);


//START THE SERVER
//====================================
app.listen(port);
console.log("Magic is happening on port " + port);
