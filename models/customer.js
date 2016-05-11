var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  telephone: {type: String, required: true},
  description: {type: String, required: true},
  status: {type: String, enum: ['Prospect', 'Saved', 'Contacted']}
});

module.exports = mongoose.model("Customer", CustomerSchema);
