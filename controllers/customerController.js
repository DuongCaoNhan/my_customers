var Customer = require("../models/customer");

//POST "/api/customers"
exports.postBeers = function(req, res) {
  var customer = new Customer();

  //assign properties
  customer.name = req.body.name;
  customer.email = req.body.email;
  customer.telephone = req.body.telephone;
  customer.description = req.body.description;
  customer.status = req.body.status;

  //save it
  customer.save(function(err) {
    if (err) res.send(err);
    res.json({ message: "Customer created!" });
  });
};

//GET "/api/customers"
exports.getBeers = function(req, res) {
  Customer.find(function(err, customers) {

    if (err) res.send(err);

    //send customers via json to client
    res.json(customers);
    console.log("customers send");

  });
};

//GET "/api/customers/:customer_id"
exports.getBeer = function(req, res) {
  Customer.findById(req.params.customer_id, function(err, customer) {
    if (err) res.send(err);

    //send customer to client via json
    res.json(customer);
  });
};

//PUT "/api/customers/:customer_id"
exports.putBeer = function(req, res) {
  Customer.findById(req.params.customer_id, function(err, customer) {

    if (req.body.name) {
      customer.name = req.body.name;
    }
    if (req.body.email) {
      customer.email = req.body.email;
    }
    if (req.body.telephone) {
      customer.telephone = req.body.telephone;
    }
    if (req.body.description) {
      customer.description = req.body.description;
    }
    if (req.body.status) {
      customer.status = req.body.status;
    }

    customer.save(function(err) {
      if (err) res.send(err);
      res.json ({ message: "Customer updated" });
    });
  });
};

//DELETE "/api/customers/:customer_id"
exports.deleteBeer = function(req, res) {
  Customer.remove({ _id: req.params.customer_id }, function(err, customer) {
    if (err) res.send (err);
    res.json({ message: "Customer deleted!" });
  });
};
