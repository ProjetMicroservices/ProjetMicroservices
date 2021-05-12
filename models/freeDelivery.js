var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const userSchema = require('./user').schema;

var freeDelivery = new Schema({
    user:userSchema,

      fromDate: {
        type: Date,
        min: '2020-09-28',
        max: '2050-05-23'
      },
      toDate: {
        type: Date,
        min: '2020-09-28',
        max: '2050-05-23'
      },



    governorate: {
    type: String, 
  },
  ville: {
    type: String,
    required: [true,'name is required']
  },
  destination:  {
    type: String,
    required: [true,'name is required']
  },
  vehicle: {
    type: String,
  },
  state: {
    type: String,
    enum: ['valid', 'invalid', 'Cancled'],
  },
  constraint:  {
    type: String,
  },
  quantite: Number ,
  quantiteDispo:Number,

  packageSize: {
    type: String,
    enum: ['big', 'meduim', 'small'],
  },
  affectedTo:String,

 
});

module.exports = mongoose.model("freeDelivery", freeDelivery);
